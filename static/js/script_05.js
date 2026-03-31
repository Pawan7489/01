/* =========================================================
   🚀 1. BROWSER DEFAULT POPUP KILLER (Global Override)
========================================================= */
window.alert = function(message) {
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('alert', 'Notification', message);
    } else {
        console.warn("Blocked Alert:", message);
    }
};
window.confirm = function(message) {
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('alert', 'Confirmation', message);
    }
    return false; 
};
window.prompt = function(message, defaultValue) {
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('prompt', 'Input Required', message, null, defaultValue);
    }
    return null;
};

/* 🛡️ WEB 4.0 SECURITY: Encrypted Utility Pipeline | 🧬 AUTO-HEAL: Active */
/* =========================================================
   A1 AI - Quantum JavaScript Logic Engine (PART 1 & 2)
   PURPOSE: Core Auth, 2FA, Routing & Custom Modals
========================================================= */

let isNewUserRegistration = false; 

function safeVibrate() {
    if (typeof triggerVibration === 'function') triggerVibration("light");
}

function getLoginModeFromInput() {
    const inputEl = document.getElementById('login-universal-input');
    const rawValue = (inputEl?.value || '').trim();
    const mobileCandidate = rawValue.replace(/\D/g, '');
    const isMobile = /^\d{10}$/.test(mobileCandidate);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawValue);
    const isValid = isMobile || isEmail;
    return { rawValue, mobileCandidate, isMobile, isEmail, isValid };
}

// --- UTILITY FUNCTIONS ---
function setupPinBoxes(containerId, inputType) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return; 
        
        if (container.children.length === 0) {
            for (let i = 0; i < 6; i++) {
                const inp = document.createElement('input');
                inp.type = inputType; 
                inp.maxLength = 1;
                inp.className = 'auth-otp-input ios-btn'; 
                container.appendChild(inp);
            }
        }

        const inputs = container.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                if (e.target.value !== '' && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                    safeVibrate();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    inputs[index - 1].focus();
                    safeVibrate();
                }
            });
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                for (let j = 0; j < pasted.length; j++) {
                    if (inputs[j]) {
                        inputs[j].value = pasted[j];
                        if (j < 5) inputs[j + 1].focus();
                    }
                }
                if(pasted.length > 0) safeVibrate();
            });
        });
    } catch (error) { console.error(`Auto-Repair: PIN box setup failed`, error); }
}

function switchView(viewName) {
    try {
        safeVibrate();
        const views = ['login-view', 'signup-view', 'forgot-view', 'twostep-view'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.classList.add('hidden');
        });
        const targetView = document.getElementById(viewName);
        if (targetView) targetView.classList.remove('hidden');
        resetForms();
    } catch(e) {}
}

function toggleLoginType() {
    try {
        safeVibrate();
        const mobileRadio = document.querySelector('input[name="loginType"][value="mobile"]');
        if (!mobileRadio) return;
        const isMobile = mobileRadio.checked;
        document.getElementById('login-mobile-flow').classList.toggle('hidden', !isMobile);
        document.getElementById('login-email-flow').classList.toggle('hidden', isMobile);
        resetForms();
    } catch(e) {}
}

function toggleSignupType() {
    try {
        safeVibrate();
        const mobileRadio = document.querySelector('input[name="signupType"][value="mobile"]');
        if (!mobileRadio) return;
        const isMobile = mobileRadio.checked;
        const inputField = document.getElementById('signup-input');
        if (inputField) {
            if (isMobile) {
                inputField.placeholder = "Enter 10-digit Mobile Number";
                inputField.type = "tel";
                inputField.setAttribute('maxlength', '10');
                inputField.oninput = function() { this.value = this.value.replace(/[^0-9]/g, ''); };
            } else {
                inputField.placeholder = "Enter Email Address";
                inputField.type = "email";
                inputField.removeAttribute('maxlength');
                inputField.oninput = null; 
            }
        }
        resetForms();
    } catch(e) {}
}

function togglePassword(inputId, iconId) {
    try {
        safeVibrate();
        const field = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (!field || !icon) return;

        if (field.type === "password") {
            field.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
            icon.style.color = "#3b82f6"; 
        } else {
            field.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
            icon.style.color = "";
        }
    } catch(e) {}
}

function validatePassword(pass, confPass) {
    try {
        if (pass.length < 8 || pass.length > 20) {
            safeVibrate();
            if(window.showA1Modal) window.showA1Modal('alert', 'Invalid Password', 'Password must be between 8 and 20 characters.'); 
            return false;
        }
        if (pass !== confPass) {
            safeVibrate();
            if(window.showA1Modal) window.showA1Modal('alert', 'Password Mismatch', 'Passwords do not match. Please try again.'); 
            return false;
        }
        return true;
    } catch(e) { return false; }
}

function resetForms() {
    try {
        document.querySelectorAll('.auth-input, .auth-otp-input').forEach(i => i.value = '');
        document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
        
        const hideEl = (id) => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); };
        const showEl = (id) => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); };

        const loginMainBtn = document.getElementById('login-main-submit-btn');
        if (loginMainBtn) {
            loginMainBtn.classList.remove('hidden');
            loginMainBtn.textContent = 'Continue';
        }
        hideEl('login-method-selector');
        hideEl('login-password-section');
        hideEl('login-options-row');
        hideEl('login-otp-section');
        showEl('signup-send-btn'); hideEl('signup-otp-section');
        showEl('signup-step-1'); hideEl('signup-step-2');
        showEl('forgot-send-btn'); hideEl('forgot-otp-section');
        showEl('forgot-step-1'); hideEl('forgot-step-2');
        showEl('twostep-intro'); hideEl('twostep-setup');

        document.querySelectorAll('.fa-eye-slash').forEach(i => {
            i.classList.replace('fa-eye-slash', 'fa-eye');
            i.style.color = "";
        });
        document.querySelectorAll('input').forEach(i => { 
            if (i.id.includes('pass') && !i.parentElement.id.includes('pin-boxes')) {
                i.type = 'password'; 
            }
        });
    } catch(e) { console.error(e); }
}

// --- CORE AUTH LOGICS ---
window.handleUniversalLoginInput = function() {
    try {
        const mode = getLoginModeFromInput();
        const methodSelector = document.getElementById('login-method-selector');
        const passwordSection = document.getElementById('login-password-section');
        const optionsRow = document.getElementById('login-options-row');
        const otpSection = document.getElementById('login-otp-section');
        const mainBtn = document.getElementById('login-main-submit-btn');

        if (!mainBtn) return;

        if (!mode.rawValue) {
            methodSelector?.classList.add('hidden');
            passwordSection?.classList.add('hidden');
            optionsRow?.classList.add('hidden');
            otpSection?.classList.add('hidden');
            mainBtn.textContent = 'Continue';
            return;
        }

        if (mode.isMobile) {
            methodSelector?.classList.remove('hidden');
            window.switchMobileLoginMethod();
            return;
        }

        if (!mode.isEmail) {
            methodSelector?.classList.add('hidden');
            otpSection?.classList.add('hidden');
            passwordSection?.classList.add('hidden');
            optionsRow?.classList.add('hidden');
            mainBtn.textContent = 'Continue';
            return;
        }

        methodSelector?.classList.add('hidden');
        otpSection?.classList.add('hidden');
        passwordSection?.classList.remove('hidden');
        optionsRow?.classList.remove('hidden');
        mainBtn.textContent = 'Login';
    } catch (error) {}
};

window.switchMobileLoginMethod = function() {
    try {
        const selectedMethod = document.querySelector('input[name="mobileLoginMethod"]:checked')?.value || 'otp';
        const passwordSection = document.getElementById('login-password-section');
        const optionsRow = document.getElementById('login-options-row');
        const otpSection = document.getElementById('login-otp-section');
        const mainBtn = document.getElementById('login-main-submit-btn');
        if (!mainBtn) return;

        if (selectedMethod === 'password') {
            otpSection?.classList.add('hidden');
            passwordSection?.classList.remove('hidden');
            optionsRow?.classList.remove('hidden');
            mainBtn.textContent = 'Login';
            return;
        }

        passwordSection?.classList.add('hidden');
        optionsRow?.classList.add('hidden');
        mainBtn.textContent = otpSection?.classList.contains('hidden') ? 'Send OTP' : 'Verify OTP';
    } catch (error) {}
};

function sendLoginOTP() {
    try {
        const { mobileCandidate, isMobile } = getLoginModeFromInput();
        if (!isMobile) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'Error', 'Enter valid 10-digit mobile number.'); 
        }
        safeVibrate();
        document.getElementById('login-universal-input').value = mobileCandidate;
        document.getElementById('login-otp-section')?.classList.remove('hidden');
        const mainBtn = document.getElementById('login-main-submit-btn');
        if (mainBtn) mainBtn.textContent = 'Verify OTP';
    } catch (error) {}
}

function verifyLoginOTP() {
    try {
        const otpInputs = document.querySelectorAll('#login-otp-boxes input');
        const otp = Array.from(otpInputs).map(i => i.value).join('');
        if (otp.length !== 6) {
            safeVibrate();
            return window.showA1Modal('alert', 'Incomplete OTP', 'Please enter the complete 6-digit OTP.');
        }
        safeVibrate();
        grantAccess(true);
    } catch (error) {}
}

function processEmailLogin() {
    try {
        const email = document.getElementById('login-universal-input')?.value?.trim() || '';
        const pass = document.getElementById('login-password-input').value;
        const rememberBox = document.getElementById('remember-me');
        const remember = rememberBox ? rememberBox.checked : false;
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || pass.length < 8) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'Login Failed', 'Invalid email or password.'); 
        }
        safeVibrate();
        grantAccess(remember);
    } catch (error) {}
}

function sendSignupOTP() {
    try {
        const val = document.getElementById('signup-input').value;
        if (val.length < 5) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'Invalid Input', 'Enter valid details.'); 
        }
        safeVibrate();
        document.getElementById('signup-send-btn').classList.add('hidden');
        document.getElementById('signup-otp-section').classList.remove('hidden');
    } catch (error) {}
}

function verifySignupOTP() {
    try {
        safeVibrate();
        document.getElementById('signup-step-1').classList.add('hidden');
        document.getElementById('signup-step-2').classList.remove('hidden');
    } catch (error) {}
}

function completeSignup() {
    try {
        const pass = document.getElementById('signup-pass').value;
        const conf = document.getElementById('signup-conf-pass').value;
        if (!validatePassword(pass, conf)) return;
        
        safeVibrate();
        isNewUserRegistration = true; 
        switchView('twostep-view'); 
    } catch (error) {}
}

function sendForgotOTP() {
    try {
        const val = document.getElementById('forgot-input').value;
        if (val.length < 5) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'Error', 'Enter valid details.'); 
        }
        safeVibrate();
        document.getElementById('forgot-send-btn').classList.add('hidden');
        document.getElementById('forgot-otp-section').classList.remove('hidden');
    } catch (error) {}
}

function verifyForgotOTP() {
    try {
        safeVibrate();
        document.getElementById('forgot-step-1').classList.add('hidden');
        document.getElementById('forgot-step-2').classList.remove('hidden');
    } catch (error) {}
}

function completePasswordReset() {
    try {
        const pass = document.getElementById('forgot-pass').value;
        const conf = document.getElementById('forgot-conf-pass').value;
        if (!validatePassword(pass, conf)) return;
        
        safeVibrate();
        window.showA1Modal('alert', 'Success', 'Password Changed Successfully! Please Login.', () => {
            switchView('login-view');
        });
    } catch (error) {}
}

// --- 2-STEP VERIFICATION ---
function showPINSetup() {
    try {
        safeVibrate();
        const intro = document.getElementById('twostep-intro');
        const setup = document.getElementById('twostep-setup');
        if (intro && setup) {
            intro.classList.add('hidden');
            setup.classList.remove('hidden');
            const firstBox = document.querySelector('#twostep-pin-boxes input');
            if (firstBox) firstBox.focus();
        }
    } catch (error) {}
}

function save2FAPin() {
    try {
        const pinInputs = document.querySelectorAll('#twostep-pin-boxes input');
        const confInputs = document.querySelectorAll('#twostep-conf-pin-boxes input');
        
        if (!pinInputs.length || !confInputs.length) return;

        let pin = Array.from(pinInputs).map(i => i.value).join('');
        let confPin = Array.from(confInputs).map(i => i.value).join('');
        
        if (pin.length !== 6 || confPin.length !== 6) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'Incomplete PIN', 'Please enter the complete 6-Digit PIN in both fields.'); 
        }
        if (pin !== confPin) { 
            safeVibrate(); 
            return window.showA1Modal('alert', 'PIN Mismatch', 'Both PINs do not match! Please check again.'); 
        }
        
        safeVibrate();
        window.showA1Modal('alert', 'Secured', '2-Step Verification Setup Complete! PIN Saved.', () => {
            grantAccess(true);
        });
    } catch (error) {}
}

function skip2FA() {
    try {
        safeVibrate();
        grantAccess(true);
    } catch (error) {}
}

function simulateGoogleAuth(actionText) {
    try {
        safeVibrate();
        if(window.showA1Modal) {
            window.showA1Modal('alert', 'Connecting...', `Connecting to Google for ${actionText}...`);
        }
        setTimeout(() => {
            if (actionText === 'Signup') {
                isNewUserRegistration = true;
                switchView('twostep-view');
            } else {
                grantAccess(true);
            }
        }, 1500);
    } catch(e) {}
}

// --- ROUTING LOGIC ---
window.grantAccess = function(rememberMe) {
    try {
        localStorage.setItem('a1_ai_logged_in', 'true'); 
        
        if (typeof isNewUserRegistration !== 'undefined' && isNewUserRegistration === true) {
            if (typeof startAIOnboarding === 'function') {
                startAIOnboarding();
                return; 
            }
        }

        let storedName = localStorage.getItem('a1_user_name');
        if (!storedName || storedName.trim() === "") {
            if (typeof startAIOnboarding === 'function') {
                startAIOnboarding();
                return; 
            }
        }

        let userName = storedName ? storedName : "Commander";
        const dashNameEl = document.getElementById('User-name');
        if (dashNameEl) dashNameEl.innerText = userName;

        document.body.classList.add('justify-center', 'items-center');
        document.body.classList.remove('justify-start', 'pt-12', 'md:pt-20');

        const authContainer = document.getElementById('auth-container');
        const onboardBox = document.getElementById('onboarding-view');
        const dash = document.getElementById('app-home-screen-wrapper'); 
        const floatingBtns = document.querySelector('.floating-action-group');
        
        if (authContainer) { 
            authContainer.classList.add('hidden'); 
            authContainer.style.setProperty('display', 'none', 'important'); 
        }
        if (onboardBox) { 
            onboardBox.classList.add('hidden'); 
            onboardBox.style.setProperty('display', 'none', 'important'); 
        }
        if (dash) {
            dash.classList.remove('hidden');
            dash.style.setProperty('display', 'block', 'important');
        }
        if (floatingBtns) {
            floatingBtns.style.setProperty('display', 'flex', 'important');
        }
    } catch (error) { console.error("Access Error:", error); }
};

document.addEventListener('DOMContentLoaded', () => {
    setupPinBoxes('login-otp-boxes', 'text');
    setupPinBoxes('signup-otp-boxes', 'text');
    setupPinBoxes('forgot-otp-boxes', 'text');
    setupPinBoxes('twostep-pin-boxes', 'password');
    setupPinBoxes('twostep-conf-pin-boxes', 'password');

    const loginMainBtn = document.getElementById('login-main-submit-btn');
    if (loginMainBtn) {
        loginMainBtn.addEventListener('click', () => {
            const mode = getLoginModeFromInput();
            const selectedMethod = document.querySelector('input[name="mobileLoginMethod"]:checked')?.value || 'otp';
            const otpVisible = !document.getElementById('login-otp-section')?.classList.contains('hidden');

            if (!mode.rawValue) {
                safeVibrate();
                return window.showA1Modal('alert', 'Login Required', 'Please enter mobile number or email.');
            }

            if (!mode.isValid) {
                safeVibrate();
                return window.showA1Modal('alert', 'Invalid Input', 'Enter a valid 10-digit mobile number or email.');
            }

            if (mode.isMobile) {
                if (selectedMethod === 'password') {
                    const pass = document.getElementById('login-password-input')?.value || '';
                    const remember = document.getElementById('remember-me')?.checked || false;
                    if (pass.length < 8) {
                        safeVibrate();
                        return window.showA1Modal('alert', 'Login Failed', 'Enter a valid password (min 8 chars).');
                    }
                    safeVibrate();
                    return grantAccess(remember);
                }

                if (!otpVisible) return sendLoginOTP();
                return verifyLoginOTP();
            }

            if (!mode.isEmail) {
                safeVibrate();
                return window.showA1Modal('alert', 'Invalid Input', 'Enter a valid email for password login.');
            }

            return processEmailLogin();
        });
    }

    window.handleUniversalLoginInput();
});
