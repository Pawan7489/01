from flask import Flask, render_template, request, jsonify
import os
import re
import time
import hmac
import secrets
import hashlib
from threading import Lock

# Flask ऐप को इनिशियलाइज़ करना
app = Flask(__name__)

MOBILE_RE = re.compile(r"^\d{10}$")
OTP_RE = re.compile(r"^\d{6}$")
PASSWORD_RE = re.compile(r"^.{8,20}$")

OTP_TTL_SECONDS = 5 * 60
RESET_TOKEN_TTL_SECONDS = 10 * 60
OTP_RESEND_COOLDOWN_SECONDS = 30
MAX_OTP_ATTEMPTS = 5

_LOCK = Lock()
_FORGOT_STORE = {}
_USER_PASSWORDS = {}


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


def _is_valid_mobile(mobile: str) -> bool:
    return bool(MOBILE_RE.fullmatch(mobile or ""))


def _is_valid_otp(otp: str) -> bool:
    return bool(OTP_RE.fullmatch(otp or ""))


def _is_valid_password(password: str) -> bool:
    return bool(PASSWORD_RE.fullmatch(password or ""))

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

    now = _now()
    with _LOCK:
        record = _FORGOT_STORE.get(mobile, {})
        last_sent_at = int(record.get("otp_sent_at", 0))
        if now - last_sent_at < OTP_RESEND_COOLDOWN_SECONDS:
            return jsonify({"status": "success", "message": generic_message})

        otp = f"{secrets.randbelow(1_000_000):06d}"
        _FORGOT_STORE[mobile] = {
            "otp_hash": _sha256(otp),
            "otp_expires_at": now + OTP_TTL_SECONDS,
            "otp_attempts": 0,
            "otp_sent_at": now,
            "reset_token_hash": None,
            "reset_token_expires_at": 0,
        }

    response = {"status": "success", "message": generic_message}
    if os.environ.get("A1_EXPOSE_TEST_OTP", "").lower() in ("1", "true", "yes"):
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
        record = _FORGOT_STORE.get(mobile)
        if not record:
            return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

        if now > int(record.get("otp_expires_at", 0)):
            _FORGOT_STORE.pop(mobile, None)
            return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

        attempts = int(record.get("otp_attempts", 0))
        if attempts >= MAX_OTP_ATTEMPTS:
            _FORGOT_STORE.pop(mobile, None)
            return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

        otp_hash = _sha256(otp)
        if not hmac.compare_digest(otp_hash, record.get("otp_hash", "")):
            record["otp_attempts"] = attempts + 1
            _FORGOT_STORE[mobile] = record
            return jsonify({"status": "error", "message": "Invalid or expired OTP."}), 400

        reset_token = secrets.token_urlsafe(32)
        record["otp_hash"] = None
        record["otp_expires_at"] = 0
        record["otp_attempts"] = 0
        record["reset_token_hash"] = _sha256(reset_token)
        record["reset_token_expires_at"] = now + RESET_TOKEN_TTL_SECONDS
        _FORGOT_STORE[mobile] = record

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
        record = _FORGOT_STORE.get(mobile)
        if not record:
            return jsonify({"status": "error", "message": "Invalid or expired reset session."}), 400

        token_expiry = int(record.get("reset_token_expires_at", 0))
        token_hash = record.get("reset_token_hash") or ""
        if now > token_expiry or not hmac.compare_digest(_sha256(reset_token), token_hash):
            _FORGOT_STORE.pop(mobile, None)
            return jsonify({"status": "error", "message": "Invalid or expired reset session."}), 400

        _USER_PASSWORDS[mobile] = _password_hash(new_password)
        _FORGOT_STORE.pop(mobile, None)

    return jsonify({"status": "success", "message": "Password reset successful."})

# Render सर्वर के लिए पोर्ट कॉन्फ़िगरेशन
if __name__ == '__main__':
    # Render अपने आप एक PORT देता है, नहीं तो डिफ़ॉल्ट 5000 इस्तेमाल होगा
    port = int(os.environ.get('PORT', 5000))
    # host='0.0.0.0' ज़रूरी है ताकि Render इसे बाहरी दुनिया को दिखा सके
    app.run(host='0.0.0.0', port=port, debug=False)
    
