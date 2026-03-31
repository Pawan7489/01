// ==========================================
// 🍪 COOKIE & PRIVACY CONSENT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // चेक करें कि क्या यूज़र ने पहले कुकी एक्सेप्ट की है?
    const cookieConsent = localStorage.getItem("a1_cookie_consent");
    const cookieOverlay = document.getElementById("cookie-consent-overlay");
    
    if (!cookieConsent && cookieOverlay) {
        // नया यूज़र है या डेटा क्लियर हो गया है, तो 1 सेकंड बाद पॉपअप दिखाएँ
        setTimeout(() => {
            cookieOverlay.classList.remove("hidden");
        }, 1000);
    }
});

window.handleCookieConsent = function(action) {
    if(typeof triggerVibration === 'function') triggerVibration("light");
    
    const cookieOverlay = document.getElementById("cookie-consent-overlay");
    
    if (action === 'manage') {
        alert("Manage Cookies settings jaldi hi yahan connect ki jayengi.");
        return; // इसे दबाने पर पॉपअप बंद नहीं होगा (आप चाहें तो करा सकते हैं)
    } 
    
    // Accept, Reject या Close करने पर ब्राउज़र में सेव कर लें
    if (action === 'accept') localStorage.setItem("a1_cookie_consent", "accepted");
    else if (action === 'reject') localStorage.setItem("a1_cookie_consent", "rejected");
    else if (action === 'close') localStorage.setItem("a1_cookie_consent", "dismissed");

    // पॉपअप को प्यार से (Smoothly) बंद करें
    if (cookieOverlay) {
        cookieOverlay.classList.add("hidden");
        setTimeout(() => { cookieOverlay.style.display = "none"; }, 300);
    }
};
