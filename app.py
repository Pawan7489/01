from flask import Flask, render_template, request, jsonify
import os
import re
import time
import json
import hmac
import sqlite3
import secrets
import hashlib
from threading import Lock

try:
    import redis
except Exception:  # pragma: no cover
    redis = None

# Flask ऐप को इनिशियलाइज़ करना
app = Flask(__name__)

MOBILE_RE = re.compile(r"^\d{10}$")
OTP_RE = re.compile(r"^\d{6}$")
PASSWORD_RE = re.compile(r"^.{8,20}$")

OTP_TTL_SECONDS = 5 * 60
RESET_TOKEN_TTL_SECONDS = 10 * 60
OTP_RESEND_COOLDOWN_SECONDS = 30
MAX_OTP_ATTEMPTS = 5
AUTH_TOKEN_TTL_SECONDS = 10 * 60

_LOCK = Lock()
_MEMORY_STORE = {}

DB_PATH = os.environ.get("A1_DB_PATH", os.path.join(os.path.dirname(__file__), "a1_auth.db"))
REDIS_URL = os.environ.get("REDIS_URL", "").strip()
REDIS_SOCKET_TIMEOUT_SECONDS = float(os.environ.get("REDIS_SOCKET_TIMEOUT_SECONDS", "3"))
REDIS_CONNECT_TIMEOUT_SECONDS = float(os.environ.get("REDIS_CONNECT_TIMEOUT_SECONDS", "3"))
_REDIS_CLIENT = None
_REDIS_ENABLED = False


def _now():
    return int(time.time())


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 150000
    ).hex()
    return f"{salt}${digest}"


def _verify_password(password: str, stored_value: str) -> bool:
    try:
        salt, digest = stored_value.split("$", 1)
    except ValueError:
        return False
    check = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 150000
    ).hex()
    return hmac.compare_digest(check, digest)


def _is_valid_mobile(mobile: str) -> bool:
    return bool(MOBILE_RE.fullmatch(mobile or ""))


def _is_valid_otp(otp: str) -> bool:
    return bool(OTP_RE.fullmatch(otp or ""))


def _is_valid_password(password: str) -> bool:
    return bool(PASSWORD_RE.fullmatch(password or ""))


def _is_valid_email(email: str) -> bool:
    if not email or len(email) > 254:
        return False
    if email.count("@") != 1:
        return False
    local, domain = email.split("@", 1)
    return bool(local and "." in domain and not domain.startswith(".") and not domain.endswith("."))


def _db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _init_db():
    conn = _db_conn()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mobile TEXT UNIQUE,
                email TEXT UNIQUE,
                password_hash TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        conn.commit()
    finally:
        conn.close()


def _get_user_by_mobile(mobile: str):
    conn = _db_conn()
    try:
        row = conn.execute(
            "SELECT id, mobile, email, password_hash FROM users WHERE mobile = ? LIMIT 1", (mobile,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def _get_user_by_email(email: str):
    conn = _db_conn()
    try:
        row = conn.execute(
            "SELECT id, mobile, email, password_hash FROM users WHERE email = ? LIMIT 1", (email,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def _create_user(mobile: str | None, email: str | None, password_hash: str) -> bool:
    if not mobile and not email:
        return False
    conn = _db_conn()
    try:
        conn.execute(
            "INSERT INTO users (mobile, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (mobile, email, password_hash, _now()),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def _update_user_password_by_mobile(mobile: str, password_hash: str) -> bool:
    conn = _db_conn()
    try:
        cur = conn.execute("UPDATE users SET password_hash = ? WHERE mobile = ?", (password_hash, mobile))
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()


def _session_key(namespace: str, key: str) -> str:
    return f"a1:{namespace}:{key}"


def _init_redis():
    global _REDIS_CLIENT, _REDIS_ENABLED
    if not REDIS_URL or redis is None:
        _REDIS_CLIENT = None
        _REDIS_ENABLED = False
        return
    try:
        client = redis.from_url(
            REDIS_URL,
            decode_responses=True,
            socket_timeout=REDIS_SOCKET_TIMEOUT_SECONDS,
            socket_connect_timeout=REDIS_CONNECT_TIMEOUT_SECONDS,
        )
        client.ping()
        _REDIS_CLIENT = client
        _REDIS_ENABLED = True
    except Exception:
        _REDIS_CLIENT = None
        _REDIS_ENABLED = False


def _session_get(namespace: str, key: str):
    sk = _session_key(namespace, key)
    if _REDIS_ENABLED and _REDIS_CLIENT:
        try:
            value = _REDIS_CLIENT.get(sk)
            if value is None:
                return None
            return json.loads(value)
        except Exception:
            pass
    rec = _MEMORY_STORE.get(sk)
    if not rec:
        return None
    if _now() >= int(rec.get("_expires_at", 0)):
        _MEMORY_STORE.pop(sk, None)
        return None
    return rec.get("value")


def _session_set(namespace: str, key: str, value: dict, ttl_seconds: int):
    sk = _session_key(namespace, key)
    ttl = max(int(ttl_seconds), 1)
    if _REDIS_ENABLED and _REDIS_CLIENT:
        try:
            _REDIS_CLIENT.setex(sk, ttl, json.dumps(value))
            return
        except Exception:
            pass
    _MEMORY_STORE[sk] = {"value": value, "_expires_at": _now() + ttl}


def _session_delete(namespace: str, key: str):
    sk = _session_key(namespace, key)
    if _REDIS_ENABLED and _REDIS_CLIENT:
        try:
            _REDIS_CLIENT.delete(sk)
        except Exception:
            pass
    _MEMORY_STORE.pop(sk, None)


def _issue_otp(namespace: str, key: str, allow_verify: bool = True) -> str | None:
    now = _now()
    rec = _session_get(namespace, key) or {}
    if now - int(rec.get("otp_sent_at", 0)) < OTP_RESEND_COOLDOWN_SECONDS:
        return None

    otp = f"{secrets.randbelow(1_000_000):06d}"
    rec = {
        "otp_hash": _sha256(otp),
        "otp_expires_at": now + OTP_TTL_SECONDS,
        "otp_attempts": 0,
        "otp_sent_at": now,
        "allow_verify": bool(allow_verify),
    }
    _session_set(namespace, key, rec, OTP_TTL_SECONDS + RESET_TOKEN_TTL_SECONDS)
    return otp


def _verify_otp(namespace: str, key: str, otp: str) -> tuple[bool, str]:
    now = _now()
    rec = _session_get(namespace, key)
    if not rec:
        return False, "Invalid or expired OTP."
    if now > int(rec.get("otp_expires_at", 0)):
        _session_delete(namespace, key)
        return False, "Invalid or expired OTP."

    attempts = int(rec.get("otp_attempts", 0))
    if attempts >= MAX_OTP_ATTEMPTS:
        _session_delete(namespace, key)
        return False, "Invalid or expired OTP."

    if not hmac.compare_digest(_sha256(otp), rec.get("otp_hash", "")):
        rec["otp_attempts"] = attempts + 1
        _session_set(namespace, key, rec, OTP_TTL_SECONDS + RESET_TOKEN_TTL_SECONDS)
        return False, "Invalid or expired OTP."

    allow_verify = bool(rec.get("allow_verify", False))
    _session_delete(namespace, key)
    if not allow_verify:
        return False, "Invalid credentials."
    return True, ""


def _is_test_otp_enabled() -> bool:
    return os.environ.get("A1_EXPOSE_TEST_OTP", "").lower() in ("1", "true", "yes")


_init_db()
_init_redis()


# 1. होम पेज राऊट (जब कोई वेबसाइट खोलेगा तो यह चलेगा)
@app.route('/')
def home():
    # यह templates फोल्डर से index.html को लोड करेगा
    return render_template('index.html')


# 3. API राऊट (भविष्य में लॉगिन/साइनअप का डेटा यहाँ आएगा)
@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json(silent=True) or {}
    # अभी के लिए हम सिर्फ सक्सेस मैसेज भेज रहे हैं।
    # बाद में हम यहाँ असली डेटाबेस जोड़ेंगे।
    return jsonify({
        "status": "success",
        "message": f"Hello Commander! Data received for {data.get('type')}"
    })


@app.route('/api/forgot/request', methods=['POST'])
def forgot_request():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()

    generic_message = "If an account exists, OTP has been sent."
    if not _is_valid_mobile(mobile):
        return jsonify({"status": "success", "message": generic_message})

    with _LOCK:
        if not _get_user_by_mobile(mobile):
            return jsonify({"status": "success", "message": generic_message})
        otp = _issue_otp("forgot", mobile, allow_verify=True)
        if otp is None:
            return jsonify({"status": "success", "message": generic_message})
        rec = _session_get("forgot", mobile) or {}
        rec["reset_token_hash"] = None
        rec["reset_token_expires_at"] = 0
        _session_set("forgot", mobile, rec, OTP_TTL_SECONDS + RESET_TOKEN_TTL_SECONDS)

    response = {"status": "success", "message": generic_message}
    if _is_test_otp_enabled():
        response["testOtp"] = otp
    return jsonify(response)


@app.route('/api/forgot/verify', methods=['POST'])
def forgot_verify():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    otp = (data.get("otp") or "").strip()

    if not _is_valid_mobile(mobile) or not _is_valid_otp(otp):
        return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

    now = _now()
    with _LOCK:
        ok, message = _verify_otp("forgot", mobile, otp)
        if not ok:
            return jsonify({"status": "error", "message": message}), 400
        reset_token = secrets.token_urlsafe(32)
        record = {
            "reset_token_hash": _sha256(reset_token),
            "reset_token_expires_at": now + RESET_TOKEN_TTL_SECONDS
        }
        _session_set("forgot", mobile, record, RESET_TOKEN_TTL_SECONDS)

    return jsonify({
        "status": "success",
        "message": "OTP verified successfully.",
        "resetToken": reset_token
    })


@app.route('/api/forgot/reset', methods=['POST'])
def forgot_reset():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    reset_token = (data.get("resetToken") or "").strip()
    new_password = (data.get("newPassword") or "")

    if not _is_valid_mobile(mobile):
        return jsonify({"status": "error", "message": "Invalid request."}), 400
    if not _is_valid_password(new_password):
        return jsonify({"status": "error", "message": "Password must be 8-20 characters."}), 400
    if len(reset_token) < 20:
        return jsonify({"status": "error", "message": "Invalid reset session."}), 400

    now = _now()
    with _LOCK:
        record = _session_get("forgot", mobile)
        if not record:
            return jsonify({"status": "error", "message": "Invalid or expired reset session."}), 400

        token_expiry = int(record.get("reset_token_expires_at", 0))
        token_hash = record.get("reset_token_hash") or ""
        if now > token_expiry or not hmac.compare_digest(_sha256(reset_token), token_hash):
            _session_delete("forgot", mobile)
            return jsonify({"status": "error", "message": "Invalid or expired reset session."}), 400

        if not _get_user_by_mobile(mobile):
            _session_delete("forgot", mobile)
            return jsonify({"status": "error", "message": "Invalid or expired reset session."}), 400

        password_hash = _password_hash(new_password)
        _update_user_password_by_mobile(mobile, password_hash)
        _session_delete("forgot", mobile)

    return jsonify({"status": "success", "message": "Password reset successful."})


@app.route('/api/signup/mobile/request-otp', methods=['POST'])
def signup_mobile_request_otp():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    if not _is_valid_mobile(mobile):
        return jsonify({"status": "error", "message": "Enter valid 10-digit mobile number."}), 400

    with _LOCK:
        if _get_user_by_mobile(mobile):
            return jsonify({"status": "error", "message": "Account already exists for this mobile."}), 400
        otp = _issue_otp("signup_mobile_otp", mobile, allow_verify=True)
        if otp is None:
            return jsonify({"status": "error", "message": "Please wait before requesting another OTP."}), 429

    response = {"status": "success", "message": "OTP sent successfully."}
    if _is_test_otp_enabled():
        response["testOtp"] = otp
    return jsonify(response)


@app.route('/api/signup/mobile/verify-otp', methods=['POST'])
def signup_mobile_verify_otp():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    otp = (data.get("otp") or "").strip()
    if not _is_valid_mobile(mobile) or not _is_valid_otp(otp):
        return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

    with _LOCK:
        ok, message = _verify_otp("signup_mobile_otp", mobile, otp)
        if not ok:
            return jsonify({"status": "error", "message": message}), 400
        signup_token = secrets.token_urlsafe(32)
        _session_set(
            "signup_mobile_token",
            mobile,
            {"token_hash": _sha256(signup_token), "expires_at": _now() + AUTH_TOKEN_TTL_SECONDS},
            AUTH_TOKEN_TTL_SECONDS,
        )

    return jsonify({"status": "success", "message": "OTP verified.", "signupToken": signup_token})


@app.route('/api/signup/mobile/complete', methods=['POST'])
def signup_mobile_complete():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    password = data.get("password") or ""
    signup_token = (data.get("signupToken") or "").strip()

    if not _is_valid_mobile(mobile):
        return jsonify({"status": "error", "message": "Invalid mobile number."}), 400
    if not _is_valid_password(password):
        return jsonify({"status": "error", "message": "Password must be 8-20 characters."}), 400
    if len(signup_token) < 20:
        return jsonify({"status": "error", "message": "Invalid signup session."}), 400

    with _LOCK:
        if _get_user_by_mobile(mobile):
            _session_delete("signup_mobile_token", mobile)
            return jsonify({"status": "error", "message": "Account already exists."}), 400

        token_rec = _session_get("signup_mobile_token", mobile)
        if not token_rec:
            return jsonify({"status": "error", "message": "Invalid or expired signup session."}), 400
        if _now() > int(token_rec.get("expires_at", 0)) or not hmac.compare_digest(
            _sha256(signup_token), token_rec.get("token_hash", "")
        ):
            _session_delete("signup_mobile_token", mobile)
            return jsonify({"status": "error", "message": "Invalid or expired signup session."}), 400

        password_hash = _password_hash(password)
        if not _create_user(mobile=mobile, email=None, password_hash=password_hash):
            _session_delete("signup_mobile_token", mobile)
            return jsonify({"status": "error", "message": "Account already exists."}), 400
        _session_delete("signup_mobile_token", mobile)

    return jsonify({"status": "success", "message": "Signup successful."})


@app.route('/api/signup/email/start', methods=['POST'])
def signup_email_start():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if not _is_valid_email(email):
        return jsonify({"status": "error", "message": "Please enter a valid email address."}), 400

    with _LOCK:
        if _get_user_by_email(email):
            return jsonify({"status": "error", "message": "Account already exists for this email."}), 400
        token = secrets.token_urlsafe(32)
        _session_set(
            "signup_email_token",
            email,
            {"token_hash": _sha256(token), "expires_at": _now() + AUTH_TOKEN_TTL_SECONDS},
            AUTH_TOKEN_TTL_SECONDS,
        )

    return jsonify({"status": "success", "message": "Email verified.", "signupToken": token})


@app.route('/api/signup/email/complete', methods=['POST'])
def signup_email_complete():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    signup_token = (data.get("signupToken") or "").strip()

    if not _is_valid_email(email):
        return jsonify({"status": "error", "message": "Invalid email address."}), 400
    if not _is_valid_password(password):
        return jsonify({"status": "error", "message": "Password must be 8-20 characters."}), 400
    if len(signup_token) < 20:
        return jsonify({"status": "error", "message": "Invalid signup session."}), 400

    with _LOCK:
        if _get_user_by_email(email):
            _session_delete("signup_email_token", email)
            return jsonify({"status": "error", "message": "Account already exists."}), 400

        token_rec = _session_get("signup_email_token", email)
        if not token_rec:
            return jsonify({"status": "error", "message": "Invalid or expired signup session."}), 400
        if _now() > int(token_rec.get("expires_at", 0)) or not hmac.compare_digest(
            _sha256(signup_token), token_rec.get("token_hash", "")
        ):
            _session_delete("signup_email_token", email)
            return jsonify({"status": "error", "message": "Invalid or expired signup session."}), 400

        password_hash = _password_hash(password)
        if not _create_user(mobile=None, email=email, password_hash=password_hash):
            _session_delete("signup_email_token", email)
            return jsonify({"status": "error", "message": "Account already exists."}), 400
        _session_delete("signup_email_token", email)

    return jsonify({"status": "success", "message": "Signup successful."})


@app.route('/api/login/mobile/request-otp', methods=['POST'])
def login_mobile_request_otp():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    generic_message = "If credentials are valid, OTP has been sent."
    if not _is_valid_mobile(mobile):
        return jsonify({"status": "success", "message": generic_message})

    with _LOCK:
        allow_verify = _get_user_by_mobile(mobile) is not None
        otp = _issue_otp("login_mobile_otp", mobile, allow_verify=allow_verify)
        if otp is None:
            return jsonify({"status": "success", "message": generic_message})

    response = {"status": "success", "message": generic_message}
    if _is_test_otp_enabled():
        response["testOtp"] = otp
    return jsonify(response)


@app.route('/api/login/mobile/verify-otp', methods=['POST'])
def login_mobile_verify_otp():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    otp = (data.get("otp") or "").strip()
    if not _is_valid_mobile(mobile) or not _is_valid_otp(otp):
        return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

    with _LOCK:
        ok, message = _verify_otp("login_mobile_otp", mobile, otp)
        if not ok:
            return jsonify({"status": "error", "message": message}), 400
    return jsonify({"status": "success", "message": "Login successful."})


@app.route('/api/login/mobile/password', methods=['POST'])
def login_mobile_password():
    data = request.get_json(silent=True) or {}
    mobile = (data.get("mobile") or "").strip()
    password = data.get("password") or ""
    if not _is_valid_mobile(mobile) or not _is_valid_password(password):
        return jsonify({"status": "error", "message": "Invalid credentials."}), 400

    with _LOCK:
        user = _get_user_by_mobile(mobile)
        if not user or not _verify_password(password, user.get("password_hash", "")):
            return jsonify({"status": "error", "message": "Invalid credentials."}), 400
    return jsonify({"status": "success", "message": "Login successful."})


@app.route('/api/login/email/password', methods=['POST'])
def login_email_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not _is_valid_email(email) or not _is_valid_password(password):
        return jsonify({"status": "error", "message": "Invalid credentials."}), 400

    with _LOCK:
        user = _get_user_by_email(email)
        if not user or not _verify_password(password, user.get("password_hash", "")):
            return jsonify({"status": "error", "message": "Invalid credentials."}), 400
    return jsonify({"status": "success", "message": "Login successful."})


# Render सर्वर के लिए पोर्ट कॉन्फ़िगरेशन
if __name__ == '__main__':
    # Render अपने आप एक PORT देता है, नहीं तो डिफ़ॉल्ट 5000 इस्तेमाल होगा
    port = int(os.environ.get('PORT', 5000))
    # host='0.0.0.0' ज़रूरी है ताकि Render इसे बाहरी दुनिया को दिखा सके
    app.run(host='0.0.0.0', port=port, debug=False)
