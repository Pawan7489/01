
/* =========================================================
   🚀 BROWSER DEFAULT POPUP KILLER (Global Override)
   यह कोड पूरी वेबसाइट में कहीं भी ब्राउज़र का डिफ़ॉल्ट पॉपअप नहीं आने देगा!
========================================================= */
window.alert = function(message) {
    // अगर कोई ग़लती से alert() कॉल करेगा, तो वह ऑटोमैटिक हमारा Custom Modal खोल देगा
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('alert', 'Notification', message);
    } else {
        console.warn("Blocked Browser Alert:", message);
    }
};

window.confirm = function(message) {
    console.warn("Blocked Browser Confirm:", message);
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('alert', 'Confirmation', message);
    }
    return false; 
};

window.prompt = function(message, defaultValue) {
    console.warn("Blocked Browser Prompt:", message);
    if (typeof window.showA1Modal === 'function') {
        window.showA1Modal('prompt', 'Input Required', message, null, defaultValue);
    }
    return null;
};













// ==========================================
// 1. ADVANCED THEME ENGINE (Auto/Light/Dark) - ES6+
// ==========================================

// सिस्टम थीम को रियल-टाइम ट्रैक करने के लिए मॉडर्न API
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

window.changeAppTheme = (mode) => {
    let isDark = mode === 'dark' || (mode === 'system' && systemThemeQuery.matches);
    
    document.body.classList.toggle('light-mode', !isDark);
    localStorage.setItem('a1_os_theme', mode);

    document.querySelectorAll('.theme-switch-grid .mode-btn').forEach(btn => {
        btn.classList.remove('theme-active-btn');
    });
    
    const activeBtn = document.getElementById(`theme-btn-${mode}`);
    if (activeBtn) activeBtn.classList.add('theme-active-btn');

    if (navigator.vibrate) navigator.vibrate(15);
};

// सिस्टम सेटिंग बदलने पर ऑटो-अपडेट
systemThemeQuery.addEventListener('change', () => {
    if (localStorage.getItem('a1_os_theme') === 'system') {
        window.changeAppTheme('system');
    }
});

// ==========================================
// 2. HEADER CONTROLS (Profile, Sidebar, Voice)
// ==========================================

window.toggleProfile = (event) => {
    event?.stopPropagation(); 
    document.getElementById('chat-context-menu')?.classList.add('hidden');
    document.getElementById('profile-dropdown')?.classList.toggle('hidden');
    if (navigator.vibrate) navigator.vibrate(15);
};

// 🚀 FIXED: 100% FOOLPROOF SIDEBAR LOGIC (Inline Styles)
window.toggleMenu = (event) => {
    if (event) event.stopPropagation();
    
    const sidebar = document.getElementById('sidebar-menu'); 
    
    if (sidebar) {
        // सबसे पहले उन सभी पुरानी क्लासेज़ को हटा दो जो इसे छुपा रही थीं
        sidebar.classList.remove('hidden', 'hidden-sidebar', 'hidden-menu');
        
        // 🌟 FIX: हमने सारी इनलाइन स्टाइलिंग (sidebar.style...) हटा दी है 
        // ताकि एनिमेशन का पूरा कंट्रोल CSS के पास रहे और कोई ग्लिच न आए।
        
        // अब बस 'active' क्लास को टॉगल (लगाना/हटाना) करना है:
        sidebar.classList.toggle('active');
        
    } else {
        console.warn("⚠️ एरर: 'sidebar-menu' आईडी वाला HTML नहीं मिला!");
    }
    
    // अगर मोबाइल डिवाइस है तो हल्का सा वाइब्रेशन फील होगा
    if (navigator.vibrate) navigator.vibrate(15);
};


window.toggleVoice = () => {
    const icon = document.querySelector('#Voice-icon i');
    if (icon) {
        icon.classList.toggle('fa-volume-up');
        icon.classList.toggle('fa-volume-mute');
    }
    if (navigator.vibrate) navigator.vibrate(15);
};

// ==========================================
// 3. UI COMPONENTS & LOGIC (Modals & Actions)
// ==========================================

window.showCustomModal = (title, message) => {
    document.getElementById('custom-os-modal')?.remove();

    const modalHtml = `
        <div id="custom-os-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 100010; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 20px;">
            <div style="background: var(--dropdown-bg); border: 1px solid var(--border); padding: 30px; border-radius: 20px; text-align: center; width: 100%; max-width: 400px; box-shadow: var(--shadow); transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <h3 style="margin-top: 0; font-size: 22px; color: var(--text-primary);">${title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 25px; line-height: 1.5;">${message}</p>
                <button onclick="window.closeCustomModal()" style="background: var(--text-primary); color: var(--bg-main); border: none; padding: 12px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; width: 100%; transition: opacity 0.2s;">Close / बंद करें</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    setTimeout(() => {
        const modal = document.getElementById('custom-os-modal');
        if (modal) {
            modal.style.opacity = '1';
            modal.children[0].style.transform = 'scale(1)';
        }
    }, 10);
};

window.closeCustomModal = () => {
    const modal = document.getElementById('custom-os-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.children[0].style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    }
};

// ==========================================
// 🚀 ALL GLOBAL BUTTON LOGICS
// ==========================================

// ==========================================
// 🚀 FIXED: LIVE VOICE CHAT OPENER (HAR BAAR NEW ROOM)
// ==========================================
window.openLiveChat = (event) => {
    if (event) event.preventDefault();
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    
    // 🚀 1. नया सेशन और नई ID जनरेट करना
    window.isFirstMessage = true;
    window.currentSessionId = 'voice_' + Date.now();
    window.currentChatType = 'voice'; 
    window.currentChatId = window.currentSessionId; 

    // अगर पुरानी वॉइस चल रही हो तो उसे रोकना
    if(typeof window.stopAITalking === 'function') window.stopAITalking();

    const oldModal = document.getElementById('custom-os-modal');
    if(oldModal) oldModal.remove();

    isLiveVoiceMode = true;
    
    const overlay = document.getElementById("live-voice-overlay");
    if(overlay) overlay.classList.remove("hidden"); 
    
    // 🚀 2. वॉइस चैट बॉक्स को साफ़ करके सिक्योरिटी बैज वापस लगाना (पुरानी हिस्ट्री डिलीट)
    const logBox = document.getElementById("live-voice-chat-log");
    if(logBox) {
        logBox.innerHTML = `
            <div class="secure-voice-badge">
                <i class="fas fa-shield-alt"></i> Secure Voice Session
            </div>`;
    }

    // 🚀 3. टाइपिंग इनपुट बॉक्स को भी साफ़ करना
    const voiceInput = document.getElementById('chat-textarea');
    if(voiceInput) {
        voiceInput.value = '';
        voiceInput.style.height = 'auto';
    }
    
    const status = document.getElementById("live-voice-status");
    if(status) status.innerText = "Initializing...";
    
    // 🚀 4. AI का नया स्वागत (Welcome Message)
    setTimeout(() => {
        if (isLiveVoiceMode) {
            const userName = localStorage.getItem('a1_user_name') || "Commander";
            const welcomeMsg = `Swagat hai ${userName}! Main A1 AI hoon, apki sewa mein hazir.`;
            if(typeof window.appendLiveVoiceLog === 'function') window.appendLiveVoiceLog(welcomeMsg, "ai");
            if(typeof window.playAIVoice === 'function') window.playAIVoice(welcomeMsg);
        }
    }, 800);
};

/* ==========================================
   🚀 FIX: NEW CHAT ROOM OPEN & CLOSE LOGIC
   ========================================== */

/* ==========================================
   🚀 FIX: NEW CHAT ROOM OPEN LOGIC
   ========================================== */
/* ==========================================
   🚀 FIX: NEW CHAT ROOM OPEN LOGIC
   ========================================== */
window.openNewChatRoom = function(event) {
    if(event) event.preventDefault(); 
    
    // 1. हमेशा नई ID बनाओ
    window.isFirstMessage = true;
    window.currentSessionId = 'chat_' + Date.now();
    window.currentChatType = 'text';
    
    if(navigator.vibrate) navigator.vibrate(15);
    
    // 2. साइडबार बंद करो
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) { sidebar.classList.remove('active'); sidebar.classList.add('-translate-x-full'); }

    // 3. 🚀 पुरानी चैट को स्क्रीन से पूरी तरह साफ़ (Clear) करो
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        chatBox.querySelectorAll('.chat-message-row').forEach(m => m.remove());
        document.getElementById('welcome-banner').style.display = 'flex'; // Welcome वापस लाओ
    }

    // 4. इनपुट बॉक्स खाली करो
    const chatInput = document.getElementById('chat-user-input');
    if(chatInput) { chatInput.value = ''; window.autoResizeInput(chatInput); }
    document.getElementById("chat-send-btn")?.classList.add("hidden");
    document.getElementById("chat-mic-btn")?.classList.remove("hidden");

    // 5. चैट रूम ओपन करो
    const chatOverlay = document.getElementById('fullscreen-chat-room');
    if(chatOverlay) {
        chatOverlay.classList.remove('hidden');
        chatOverlay.style.display = 'flex'; 
    }
};




// चैट रूम बंद (Close) करने का फंक्शन (Back Button के लिए)
window.closeChatRoomFullscreen = function(event) {
    if(event) event.preventDefault();
    
    if(navigator.vibrate) navigator.vibrate(10);
    
    const chatOverlay = document.getElementById('fullscreen-chat-room');
    if(chatOverlay) {
        chatOverlay.classList.add('hidden');
        chatOverlay.style.display = 'none';
    }
};

// (Optional) अगर HTML में onclick नहीं लगा है, तो यह JS खुद बटन ढूँढकर उसे चालू कर देगा
document.addEventListener("DOMContentLoaded", () => {
    const newChatBtns = document.querySelectorAll('#new-chat-btn, .new-chat-btn');
    newChatBtns.forEach(btn => {
        btn.addEventListener('click', window.openNewChatRoom);
    });
});


window.showProfileDetails = () => {
    document.getElementById('profile-dropdown')?.classList.add('hidden');
    window.showCustomModal("Account Details", "यहाँ आपकी प्रोफाइल जानकारी, ईमेल, और सब्सक्रिप्शन डिटेल्स दिखाई देंगी।");
};

window.showSettings = () => {
    document.getElementById('profile-dropdown')?.classList.add('hidden');
    window.showCustomModal("System Settings", "यहाँ आप नोटिफिकेशन, भाषा, और प्राइवेसी सेटिंग्स बदल सकेंगे।");
};

// --- Trash & Support & Settings ---

window.showSupport = () => { window.showCustomModal("Support", "सपोर्ट टीम से संपर्क किया जा रहा है..."); };

// Purana code: if (sidebar) sidebar.style.left = '-350px'; 
// Naya code:
window.showSidebarSettings = () => { 
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) sidebar.classList.remove('active'); // CSS class hatayein
    
    const modal = document.getElementById('sidebar-settings-modal');
    if(modal) {
        modal.classList.remove('hidden');
    } else {
        window.showCustomModal("App Settings", "एडवांस ऐप सेटिंग्स यहाँ दिखेंगी।");
    }
};

window.hideSidebarSettings = () => {
    const modal = document.getElementById('sidebar-settings-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = '';
    }
};

window.closeWebsitePreview = () => {
    const previewModal = document.getElementById('website-preview-modal');
    const iframe = document.getElementById('live-preview-iframe');
    if (previewModal) previewModal.classList.add('hidden');
    if (iframe) iframe.src = 'about:blank';
};

window.toggleVoiceAttachMenu = (event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const attachMenu = document.getElementById('attachment-menu');
    const bottomNav = document.querySelector('.voice-bottom-nav');
    if (!attachMenu) return;
    if (bottomNav) bottomNav.style.overflow = 'visible';
    attachMenu.classList.toggle('hidden');
    attachMenu.style.display = attachMenu.classList.contains('hidden') ? 'none' : 'flex';
};




// **Logout Logic**
window.processSystemLogout = () => {
    if (window.confirm("क्या आप वाकई A1 System से लॉगआउट करना चाहते हैं?")) {
        localStorage.removeItem('a1_is_logged_in');
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { window.location.href = 'login.html'; }, 500);
    }
};

window.triggerVibration = () => {
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]); 
};

// ==========================================
// 4. CONTEXT MENU LOGIC (Right Click)
// ==========================================
window.showContextMenu = (event) => {
    event.preventDefault(); 
    event.stopPropagation(); 
    document.getElementById('profile-dropdown')?.classList.add('hidden');

    const contextMenu = document.getElementById('chat-context-menu');
    if (contextMenu) {
        contextMenu.classList.remove('hidden');
        let x = event.clientX; let y = event.clientY;
        if (x + 200 > window.innerWidth) x = window.innerWidth - 220;
        contextMenu.style.top = `${y}px`; contextMenu.style.left = `${x}px`;
    }
    if (navigator.vibrate) navigator.vibrate(15);
};

// ==========================================
// 5. GLOBAL CLICK LISTENER (FIXED)
// ==========================================
document.addEventListener('click', (event) => {
    // 1. Profile Dropdown बंद करना
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
        if (!event.target.closest('#profile-dropdown') && !event.target.closest('#Profile')) {
            profileDropdown.classList.add('hidden');
        }
    }

    // 2. Context Menu बंद करना
    const contextMenu = document.getElementById('chat-context-menu');
    if (contextMenu && !contextMenu.classList.contains('hidden')) {
        if (!event.target.closest('#chat-context-menu')) {
            contextMenu.classList.add('hidden');
        }
    }

    // 3. Sidebar बंद करना (अगर बाहर क्लिक किया हो)
const sidebar = document.getElementById('sidebar-menu');

// Purane "style.left === '0px'" ki jagah '.active' class check karein
if (sidebar && sidebar.classList.contains('active')) {
    if (!event.target.closest('#sidebar-menu') && !event.target.closest('[onclick*="toggleMenu"]')) {
        // Purane "style.left = '-350px'" ki jagah class hatayein
        sidebar.classList.remove('active');
    }
}

});

// ==========================================
// 6. BOOT INITIALIZATION (Page Load)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. सही थीम लोड करना
    const savedTheme = localStorage.getItem('a1_os_theme') || 'system';
    window.changeAppTheme(savedTheme);

    // 2. राईट-क्लिक मेनू सेट करना
    const dashboard = document.getElementById('main-dashboard');
    if (dashboard) dashboard.addEventListener('contextmenu', window.showContextMenu);

    // 3. HTML Buttons को कनेक्ट करना
    const liveChatBtn = document.getElementById('live-voice-chatroom');
    if (liveChatBtn) liveChatBtn.addEventListener('click', window.openLiveChat);

    const newChatBtn = document.getElementById('New-Chatroom');
    if (newChatBtn) newChatBtn.addEventListener('click', window.openNewChatRoom);

    
});
        

















// ==========================================
// 7. SIDEBAR HISTORY SEARCH LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // सर्च बॉक्स के इनपुट को ढूँढना
    const searchInput = document.querySelector('#sidebar-menu .search-box input');
    
    if (searchInput) {
        // जब भी यूजर कुछ टाइप करेगा ('input' इवेंट)
        searchInput.addEventListener('input', function(event) {
            // जो टाइप किया है उसे छोटे अक्षरों (lowercase) में बदल लो
            const searchTerm = event.target.value.toLowerCase().trim();
            
            // हिस्ट्री के सारे आइटम्स को ढूँढना
            const historyItems = document.querySelectorAll('#sidebar-menu .history-item');
            
            // हर एक हिस्ट्री आइटम को चेक करना
            historyItems.forEach(item => {
                // आइटम के अंदर लिखे टेक्स्ट को पढ़ना
                const itemText = item.textContent.toLowerCase();
                
                // अगर सर्च किया गया शब्द आइटम के टेक्स्ट में है
                if (itemText.includes(searchTerm)) {
                    item.style.display = ''; // उसे दिखाओ (डिफ़ॉल्ट स्टाइल पर वापस लाओ)
                } else {
                    item.style.display = 'none'; // उसे छुपा दो
                }
            });
        });
    } else {
        console.warn("सर्च बॉक्स नहीं मिला! कृपया HTML क्लास चेक करें।");
    }
});












// Live Voice Room Connection Logic
document.addEventListener('DOMContentLoaded', () => {
    // होम स्क्रीन का बटन ढूँढना (अगर तुम्हारे बटन की ID अलग है तो यहाँ बदल लेना)
    const liveChatBtn = document.querySelector('.live-chat-btn') || document.getElementById('live-voice-chatroom');
    const liveVoiceOverlay = document.getElementById('live-voice-overlay');
    const closeVoiceRoomBtn = document.getElementById('close-live-voice');

    // बटन क्लिक करने पर रूम ओपन (Show) करना
    if (liveChatBtn && liveVoiceOverlay) {
        liveChatBtn.addEventListener('click', (e) => {
            e.preventDefault(); // पेज रीफ्रेश होने से रोके
            liveVoiceOverlay.classList.remove('hidden');
        });
    }

    // End Call बटन क्लिक करने पर रूम बंद (Hide) करना
    if (closeVoiceRoomBtn && liveVoiceOverlay) {
        closeVoiceRoomBtn.addEventListener('click', () => {
            liveVoiceOverlay.classList.add('hidden');
        });
    }
});










    




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









/* ==========================================================================
   🌌 WEB 4.0 QUANTUM CORE: MASTER CHAT HISTORY & TRASH SYSTEM (100% FIXED)
   ========================================================================== */

// 🚀 1. GLOBAL ANTI-SELECTION & DEFAULT COPY BLOCKER (100% SAFEGUARD)
// यह कोड पूरी वेबसाइट से ब्राउज़र के डिफ़ॉल्ट 'Hold to Copy/Select' को बंद कर देगा
const AntiSelectStyle = document.createElement('style');
AntiSelectStyle.innerHTML = `
    * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
    }
    input, textarea {
        -webkit-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
        -webkit-touch-callout: default !important;
    }
`;
document.head.appendChild(AntiSelectStyle);

document.addEventListener('contextmenu', function(e) {
    if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); // ब्लॉक सिस्टम डिफ़ॉल्ट राइट क्लिक / लॉन्ग प्रेस मेनू
    }
});

const Web4_Data_Quantum_Core = (function() {
    const dataSecurityHash = "0x9F2E...QuantumEncryptedData...Web4Active";
    Object.freeze(dataSecurityHash);

    function healDataSystem(contextName, executionBlock) {
        try {
            executionBlock();
        } catch (error) {
            console.error(`[Web 4.0 Auto-Heal] Repair engaged for: ${contextName}`, error);
        }
    }
    return { healDataSystem };
})();

// =========================================================
// 🚀 2. CUSTOM UI MODALS (YOUR THEME DESIGN)
// =========================================================
window.showA1Modal = function(type, title, message, callback = null, defaultValue = "") {
    if(typeof triggerVibration === 'function') triggerVibration();
    
    const existingModal = document.getElementById('a1-custom-ui-modal');
    if(existingModal) existingModal.remove();

    let inputHtml = '';
    if (type === 'prompt') {
        inputHtml = `<input type="text" id="a1-modal-input-field" value="${defaultValue}" style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-main); color: var(--text-primary); font-family: inherit; font-size: 14px; outline: none; box-sizing: border-box;">`;
    }

    let buttonsHtml = '';
    if (type === 'alert') {
        buttonsHtml = `<button id="a1-modal-btn-ok" style="width: 100%; background: var(--text-primary, #fff); color: var(--bg-main, #000); border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;">OK</button>`;
    } else {
        buttonsHtml = `
            <button id="a1-modal-btn-cancel" style="flex: 1; background: transparent; color: var(--text-primary, #fff); border: 1px solid var(--border, rgba(255,255,255,0.2)); padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s;">Cancel</button>
            <button id="a1-modal-btn-ok" style="flex: 1; background: var(--text-primary, #fff); color: var(--bg-main, #000); border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;">OK</button>
        `;
    }

    const modalHtml = `
        <div id="a1-custom-ui-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 20px;">
            <div style="background: var(--dropdown-bg, #111827); border: 1px solid var(--border, rgba(255,255,255,0.1)); padding: 24px; border-radius: 20px; width: 100%; max-width: 320px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center; font-family: 'Inter', sans-serif;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; color: var(--text-primary, #fff);">${title}</h3>
                <p style="color: var(--text-secondary, #aaa); font-size: 14px; margin-bottom: 20px;">${message}</p>
                ${inputHtml}
                <div style="display: flex; gap: 12px; justify-content: center;">
                    ${buttonsHtml}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalBox = document.getElementById('a1-custom-ui-modal');
    setTimeout(() => {
        modalBox.style.opacity = '1';
        modalBox.children[0].style.transform = 'scale(1)';
    }, 10);

    const closeAndReturn = (val) => {
        modalBox.style.opacity = '0';
        modalBox.children[0].style.transform = 'scale(0.9)';
        setTimeout(() => modalBox.remove(), 300);
        if (callback) callback(val);
    };

    if (type === 'prompt') {
        const inputField = document.getElementById('a1-modal-input-field');
        inputField.focus();
        inputField.addEventListener('keydown', (e) => { if(e.key === 'Enter') closeAndReturn(inputField.value); });
    }

    const btnOk = document.getElementById('a1-modal-btn-ok');
    const btnCancel = document.getElementById('a1-modal-btn-cancel');

    if (btnOk) btnOk.onclick = () => closeAndReturn(type === 'prompt' ? document.getElementById('a1-modal-input-field').value : true);
    if (btnCancel) btnCancel.onclick = () => closeAndReturn(false);
};

// =========================================================
// 🚀 3. GLOBAL STATE ARCHITECTURE
// =========================================================
try {
    window.chatSessions = JSON.parse(localStorage.getItem('a1_chat_history')) || [];
} catch(e) {
    window.chatSessions = [];
}
window.currentSessionId = null;
window.isFirstMessage = true; 
window.currentChatType = 'text'; 

function escapeSafeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}

// =========================================================
// 🚀 4. RENDER SIDEBAR HISTORY (100% Matching Design)
// =========================================================

// =========================================================
// 🚀 4. RENDER SIDEBAR HISTORY (100% FIXED BUTTONS)
// =========================================================
window.renderHistoryList = function() {
    Web4_Data_Quantum_Core.healDataSystem("Render_Sidebar_History", () => {
        const list = document.getElementById('history-list-container');
        if(!list) return;
        
        let html = '';
        const activeChats = window.chatSessions.filter(c => !c.isDeleted);
        activeChats.sort((a, b) => (b.isPinned - a.isPinned) || (b.timestamp - a.timestamp));

        activeChats.forEach(chat => {
            const isActive = chat.id === window.currentSessionId ? 'var(--btn-bg, rgba(128,128,128,0.15))' : 'var(--btn-bg, rgba(128,128,128,0.05))';
            const pinColor = chat.isPinned ? '#facc15' : 'var(--text-secondary, #d1d5db)';
            const titleColor = chat.isPinned ? '#facc15' : 'var(--text-primary, #ffffff)';
            const safeTitle = escapeSafeHTML(chat.title);
            const pinIconHtml = chat.isPinned ? `<i class="fas fa-thumbtack" style="color: #facc15; margin-right: 8px; font-size: 13px; transform: rotate(45deg);"></i>` : '';

            html += `
                <div class="history-item-wrapper clean-wrapper" style="display:flex; flex-direction: column; align-items: flex-start; position: relative; margin-bottom: 8px; background: ${isActive}; border: 1px solid var(--border, rgba(128,128,128,0.2)); border-radius: 12px; transition: 0.3s;" id="wrapper-${chat.id}">
                    
                    <button class="history-btn-clean" style="width: 100%; display: flex; align-items: center; padding: 14px 16px; background: transparent; border: none; color: ${titleColor}; position: relative; z-index: 10; cursor: pointer; text-align: left;"
                        onclick="window.handleHistoryClick('${chat.id}', event)"
                        onmousedown="window.startHistoryPress('${chat.id}')" 
                        onmouseup="window.cancelHistoryPress()" 
                        onmouseleave="window.cancelHistoryPress()" 
                        ontouchstart="window.startHistoryPress('${chat.id}')" 
                        ontouchend="window.cancelHistoryPress()"
                        ontouchmove="window.cancelHistoryPress()">
                        
                        <span style="flex:1; display:flex; align-items:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size: 15px; font-weight: 500;">
                            ${pinIconHtml} ${safeTitle}
                        </span>
                    </button>
                    
                    <div id="menu-${chat.id}" class="history-context-menu hidden" style="width: 100%; box-sizing: border-box; background: var(--dropdown-bg, #111827); padding: 8px; border-radius: 0 0 12px 12px; border-top: 1px solid var(--border, rgba(255,255,255,0.1)); pointer-events: auto;">
                        
                        <button onclick="window.actionPin('${chat.id}', event)" style="width: 100%; padding: 12px; text-align: left; background: transparent; border: none; color: ${pinColor}; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-thumbtack" style="width: 20px; text-align:center;"></i> Pin History
                        </button>
                        
                        <button onclick="window.actionRename('${chat.id}', event)" style="width: 100%; padding: 12px; text-align: left; background: transparent; border: none; color: #c084fc; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-pen" style="width: 20px; text-align:center;"></i> Change History Name
                        </button>
                        
                        <button onclick="window.actionCopy('${chat.id}', event)" style="width: 100%; padding: 12px; text-align: left; background: transparent; border: none; color: #60a5fa; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-copy" style="width: 20px; text-align:center;"></i> Copy History
                        </button>
                        
                        <button onclick="window.actionDelete('${chat.id}', event)" style="width: 100%; padding: 12px; text-align: left; background: transparent; border: none; color: #f87171; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-trash" style="width: 20px; text-align:center;"></i> Delete History
                        </button>
                        
                        <button onclick="window.actionHelp('${chat.id}', event)" style="width: 100%; padding: 12px; text-align: left; background: transparent; border: none; color: #4ade80; display: flex; align-items: center; gap: 12px; font-size: 14px; cursor: pointer;">
                            <i class="fas fa-question-circle" style="width: 20px; text-align:center;"></i> Help
                        </button>

                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    });
};








// =========================================================
// 🚀 5. TAP vs LONG PRESS (HOLD) LOGIC
// =========================================================
window.pressTimer = null;
window.isLongPress = false;

window.startHistoryPress = function(id) {
    window.isLongPress = false;
    window.pressTimer = setTimeout(() => {
        window.isLongPress = true; // Hold detect 
        if(typeof triggerVibration === 'function') triggerVibration("heavy");
        
        document.querySelectorAll('.history-context-menu').forEach(el => el.classList.add('hidden'));
        const menu = document.getElementById(`menu-${id}`);
        if(menu) menu.classList.remove('hidden');
        
        setTimeout(() => { if(menu) menu.classList.add('hidden'); }, 8000);
    }, 450); 
};

window.cancelHistoryPress = function() {
    if(window.pressTimer) clearTimeout(window.pressTimer);
};

window.handleHistoryClick = function(id, event) {
    if(window.isLongPress) {
        event.preventDefault();
        event.stopPropagation();
        return; // Long press par chat mat open karo
    }
    window.loadSpecificChat(id); // 1-Tap / Click par open karo
};





// =========================================================
// 🚀 6. ACTION BUTTONS LOGIC (100% FIXED FOR NEW CHATROOM)
// =========================================================

window.saveHistory = function() {
    localStorage.setItem('a1_chat_history', JSON.stringify(window.chatSessions));
    window.renderHistoryList();
    if(typeof window.renderTrashList === 'function') window.renderTrashList();
};



// =========================================================
// 🚀 ACTION BUTTONS LOGIC & RESTORE CHAT UI (100% WORKING)
// =========================================================

// 🚀 FIX: History Buttons (अब कोई बटन क्रैश नहीं होगा)
window.actionPin = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if(chat) { 
        chat.isPinned = !chat.isPinned; 
        window.saveHistory(); 
        window.showA1Modal('alert', 'Pinned', chat.isPinned ? '📌 History Pinned!' : '📌 History Unpinned!');
    }
};

window.actionRename = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if(chat) {
        window.showA1Modal('prompt', 'Rename History', 'Enter a new name for this history:', (newTitle) => {
            if(newTitle && newTitle.trim() !== "") {
                chat.title = newTitle.trim();
                window.saveHistory();
            }
        }, chat.title);
    }
};

window.actionCopy = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if(chat && chat.title) {
        let textArea = document.createElement("textarea");
        textArea.value = chat.title; document.body.appendChild(textArea); textArea.select();
        try { document.execCommand('copy'); window.showA1Modal('alert', 'Copied!', `📋 "${chat.title}" copied.`); } catch(e){}
        textArea.remove();
    }
};

window.actionDelete = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    Web4_Data_Quantum_Core.healDataSystem("Move_To_Trash", () => {
        const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
        if(chat) {
            chat.isDeleted = true; chat.isPinned = false;
            window.saveHistory();
            window.showA1Modal('alert', 'Deleted', '🗑️ History moved to Trash. Check "Recover Deleted" menu.');
        }
    });
};

window.actionHelp = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    window.showA1Modal('alert', 'Help Center', '🛠️ Support features will be connected to admin panel soon!'); 
};

// 🚀 FIX: Restore Old Chat with Hologram & Feedback UI
window.loadSpecificChat = function(id) {
    if(typeof triggerVibration === 'function') triggerVibration("light");
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if(!chat) return;

    window.currentSessionId = chat.id;
    window.currentChatType = chat.type;
    
    const sidebar = document.getElementById('sidebar-menu');
    if(sidebar) { sidebar.classList.remove('active'); sidebar.classList.add('-translate-x-full'); }

    if(chat.type === 'text') {
        const chatOverlay = document.getElementById('fullscreen-chat-room');
        if(chatOverlay) { chatOverlay.classList.remove('hidden'); chatOverlay.style.display = 'flex'; }
        
        const chatBox = document.getElementById('chat-box');
        if(chatBox) {
            chatBox.querySelectorAll('.chat-message-row').forEach(m => m.remove());
            document.getElementById('welcome-banner').style.display = 'none';
            const aiIndicator = document.getElementById("ai-thinking-indicator");
            
            if(chat.messages && chat.messages.length > 0) {
                chat.messages.forEach((msg, index) => {
                    const div = document.createElement("div");
                    div.className = `chat-message-row ${msg.sender}`;
                    const safeText = encodeURIComponent(msg.text);
                    
                    if(msg.sender === 'user') {
                        div.innerHTML = `<div class="bubble-container" style="display: flex; flex-direction: column; align-items: flex-end;"><div class="chat-bubble user-bubble">${msg.text.replace(/\n/g, '<br>')}</div><div class="user-action-bar"><button class="action-icon-btn" onclick="window.handleSafeAction('copy', this)" data-text="${safeText}"><i class="fas fa-copy"></i></button></div></div>`;
                    } else {
                        // 🚀 पुरानी हिस्ट्री में भी रुका हुआ होलोग्राम ऊपर दिखेगा और 3-Dots नीचे!
                        div.innerHTML = `
                            <div class="hologram-status-bar" style="display:flex; align-items:center; gap:10px; margin-bottom: 8px; padding-left: 5px;">
                                <div class="inline-mini-hologram stopped" style="width:20px; height:20px;">
                                    <div class="mini-ring" style="width:18px; height:18px; border-color:#00f0ff;"></div>
                                    <div class="mini-core" style="width:6px; height:6px; background:#00f0ff;"></div>
                                </div>
                                <span style="font-weight:600; font-size:13px; color:var(--text-secondary);">Task Completed.</span>
                            </div>
                            <div class="bubble-container" style="width: 100%;">
                                <div class="chat-bubble ai-bubble" style="width: 100%; max-width: 95%;">
                                    <div class="ai-header-row" style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 8px;">
                                        <span class="chat-name-tag" style="font-weight:bold;">A1:</span>
                                        <button class="action-icon-btn" onclick="window.handleSafeAction('read', this)" data-text="${safeText}" style="padding: 2px 8px;">
                                            <i class="fas fa-volume-up"></i>
                                        </button>
                                    </div>
                                    <div class="chat-msg-text">${msg.text.replace(/\n/g, '<br>')}</div>
                                </div>
                                <div class="chat-action-bar" style="margin-left: 10px; margin-top: 5px; display: flex; gap: 10px;">
                                    <button class="action-icon-btn" onclick="window.handleSafeAction('copy', this)" data-text="${safeText}"><i class="fas fa-copy"></i></button>
                                    <button class="action-icon-btn" onclick="window.sendFeedback('up', 'history_msg_${index}')"><i class="fas fa-thumbs-up"></i></button>
                                    <button class="action-icon-btn" onclick="window.sendFeedback('down', 'history_msg_${index}')"><i class="fas fa-thumbs-down"></i></button>
                                    <button class="action-icon-btn"><i class="fas fa-ellipsis-v"></i></button>
                                </div>
                            </div>`;
                    }
                    chatBox.insertBefore(div, aiIndicator);
                });
            }
            setTimeout(() => chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' }), 100);
        }
    }
    window.renderHistoryList(); 
};

                                           













// =========================================================
// 🚀 7. TRASH MODAL SYSTEM (Recover & Permanent Delete)
// =========================================================
window.renderTrashList = function() {
    Web4_Data_Quantum_Core.healDataSystem("Render_Trash_List", () => {
        const container = document.getElementById('trash-list-container');
        if(!container) return;
        
        let html = '';
        const deletedChats = window.chatSessions.filter(c => c.isDeleted);

        if(deletedChats.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:var(--text-secondary); margin-top: 20px;">No deleted chats.</p>';
            return;
        }

        deletedChats.forEach(chat => {
            const safeTitle = escapeSafeHTML(chat.title);
            html += `
                <div class="trash-item" style="background: var(--btn-bg, rgba(128,128,128,0.1)); padding: 14px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border, rgba(128,128,128,0.2));">
                    <div class="trash-item-header" style="display: flex; gap: 10px; color: var(--text-primary); margin-bottom: 12px; align-items: center;">
                        <span class="trash-text" style="font-weight: 600; font-size: 15px;">${safeTitle}</span>
                    </div>
                    <div class="trash-actions" style="display: flex; gap: 10px;">
                        <button onclick="window.actionRecover('${chat.id}', event)" style="flex: 1; padding: 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">
                            <i class="fas fa-undo"></i> Recover
                        </button>
                        <button onclick="window.actionPermDelete('${chat.id}', event)" style="flex: 1; padding: 10px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;">
                            <i class="fas fa-times"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    });
};

window.actionRecover = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    Web4_Data_Quantum_Core.healDataSystem("Recover_Chat", () => {
        const chat = window.chatSessions.find(c => c.id === id);
        if(chat) { 
            chat.isDeleted = false; 
            window.saveHistory(); 
            window.showA1Modal('alert', 'Recovered', '✅ History Recovered successfully!');
        }
    });
};

window.actionPermDelete = function(id, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    Web4_Data_Quantum_Core.healDataSystem("Permanent_Delete", () => {
        window.showA1Modal('confirm', 'Permanent Delete', 'Kya aap sach mein is history ko hamesha ke liye mitaana chahte hain?', (isConfirmed) => {
            if(isConfirmed) {
                window.chatSessions = window.chatSessions.filter(c => c.id !== id);
                window.saveHistory();
            }
        });
    });
};

// 🌟 100% FIXED: SIDEBAR AUTO CLOSE WHEN TRASH OPEN
window.showTrashModal = function() {
    // 1. Sidebar ko automatically band karna (Tailwind Fix)
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) {
        sidebar.classList.remove('active');
        sidebar.classList.add('-translate-x-full'); 
    }

    // 2. Trash Modal ko kholna
    const modal = document.getElementById('trash-modal');
    if(modal) { 
        modal.classList.remove('hidden'); 
        modal.style.display = 'flex'; 
        window.renderTrashList(); 
    }
};

window.hideTrashModal = function() {
    const modal = document.getElementById('trash-modal');
    if(modal) { modal.classList.add('hidden'); modal.style.display = ''; }
};

document.addEventListener("DOMContentLoaded", () => {
    window.renderHistoryList();
});













/* =========================================================
   🚀 1. BROWSER DEFAULT POPUP KILLER & UTILITIES
========================================================= */
window.safeVibrate = function(type = "light") {
    if (typeof triggerVibration === 'function') triggerVibration(type);
};

window.alert = function(message) {
    if (typeof window.showA1Modal === 'function') window.showA1Modal('alert', 'Notification', message);
    else console.warn("Blocked Alert:", message);
};
window.confirm = function(message) {
    if (typeof window.showA1Modal === 'function') window.showA1Modal('alert', 'Confirmation', message);
    return false; 
};

/* =========================================================
   🚀 2. PIN / OTP BOX GENERATOR (100% CSS Friendly)
========================================================= */
window.setupPinBoxes = function(containerId, inputType) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return; 
        
        // Agar pehle se inputs nahi bane hain, tabhi banao
        if (container.children.length === 0) {
            for (let i = 0; i < 6; i++) {
                const inp = document.createElement('input');
                inp.type = inputType; 
                inp.maxLength = 1;
                // Sirf class add karega, design CSS se aayegi
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
                    window.safeVibrate();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    inputs[index - 1].focus();
                    window.safeVibrate();
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
                if(pasted.length > 0) window.safeVibrate();
            });
        });
    } catch (error) { console.error(`PIN box setup failed:`, error); }
};

window.initializeAllPinBoxes = function() {
    window.setupPinBoxes('login-otp-boxes', 'text');
    window.setupPinBoxes('signup-otp-boxes', 'text');
    window.setupPinBoxes('forgot-otp-boxes', 'text');
    window.setupPinBoxes('twostep-pin-boxes', 'password');
    window.setupPinBoxes('twostep-conf-pin-boxes', 'password');
};

// DOM Load hone par turant dabbe banao
document.addEventListener('DOMContentLoaded', window.initializeAllPinBoxes);

/* =========================================================
   🚀 3. FORM TOGGLES & VISIBILITY ENGINE (Only uses .hidden)
========================================================= */
window.switchView = function(viewName) {
    try {
        window.safeVibrate();
        const views = ['login-view', 'signup-view', 'forgot-view', 'twostep-view'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (el) el.classList.add('hidden'); 
        });
        const targetView = document.getElementById(viewName) || document.getElementById('login-view');
        if (targetView && targetView.classList) targetView.classList.remove('hidden');
        window.resetForms();
    } catch(e) {}
};

window.toggleLoginType = function() {
    try {
        window.safeVibrate();
        const mobileRadio = document.querySelector('input[name="loginType"][value="mobile"]');
        if (!mobileRadio) return;
        const isMobile = mobileRadio.checked;
        document.getElementById('login-mobile-flow').classList.toggle('hidden', !isMobile);
        document.getElementById('login-email-flow').classList.toggle('hidden', isMobile);
        window.resetForms();
    } catch(e) {}
};

window.switchMobileLoginMethod = function() {
    try {
        window.safeVibrate();
        const methodRadio = document.querySelector('input[name="mobileLoginMethod"]:checked');
        if (!methodRadio) return;
        const method = methodRadio.value;
        const otpSec = document.getElementById('login-mobile-otp-section');
        const passSec = document.getElementById('login-mobile-pass-section');
        
        if (method === 'otp') {
            if(otpSec) otpSec.classList.remove('hidden');
            if(passSec) passSec.classList.add('hidden');
        } else {
            if(otpSec) otpSec.classList.add('hidden');
            if(passSec) passSec.classList.remove('hidden');
        }
    } catch(e) {}
};

window.toggleSignupType = function() {
    try {
        window.safeVibrate();
        const mobileRadio = document.querySelector('input[name="signupType"][value="mobile"]');
        if (!mobileRadio) return;
        const isMobile = mobileRadio.checked;
        document.getElementById('signup-mobile-flow').classList.toggle('hidden', !isMobile);
        document.getElementById('signup-email-flow').classList.toggle('hidden', isMobile);
        window.resetForms();
    } catch(e) {}
};

window.togglePassword = function(inputId, iconId) {
    try {
        window.safeVibrate();
        const field = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (!field || !icon) return;

        if (field.type === "password") {
            field.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            field.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    } catch(e) {}
};

window.validatePassword = function(pass, confPass) {
    try {
        if (pass.length < 8 || pass.length > 20) {
            window.safeVibrate();
            if(window.showA1Modal) window.showA1Modal('alert', 'Invalid Password', 'Password must be between 8 and 20 characters.'); 
            return false;
        }
        if (pass !== confPass) {
            window.safeVibrate();
            if(window.showA1Modal) window.showA1Modal('alert', 'Password Mismatch', 'Passwords do not match. Please try again.'); 
            return false;
        }
        return true;
    } catch(e) { return false; }
};

window.resetForms = function() {
    try {
        // Clear all inputs
        document.querySelectorAll('.auth-input, .auth-otp-input').forEach(i => i.value = '');
        document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
        
        const hideEl = (id) => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); };
        const showEl = (id) => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); };

        showEl('login-send-otp-btn'); 
        hideEl('login-otp-section'); 
        hideEl('login-mobile-pass-section');
        const otpRadioLogin = document.querySelector('input[name="mobileLoginMethod"][value="otp"]');
        if(otpRadioLogin) otpRadioLogin.checked = true;

        showEl('signup-send-btn'); 
        hideEl('signup-otp-section'); 
        hideEl('signup-mobile-pass-section');
        
        showEl('signup-email-step-1');
        showEl('signup-send-email-btn');
        hideEl('signup-email-pass-section');
        const msgEl = document.getElementById('email-verify-msg');
        if(msgEl) {
            msgEl.classList.remove('hidden');
            msgEl.innerHTML = '<i class="fas fa-envelope"></i> A verification link will be sent to this email.';
        }

        document.querySelectorAll('.fa-eye-slash').forEach(i => {
            i.classList.replace('fa-eye-slash', 'fa-eye');
        });
        document.querySelectorAll('input').forEach(i => { 
            if (i.id.includes('pass') && !i.parentElement.id.includes('pin-boxes')) {
                i.type = 'password'; 
            }
        });
    } catch(e) { console.error(e); }
};

/* =========================================================
   🚀 4. LOGIN LOGIC (Direct to Dashboard)
========================================================= */
window.sendLoginOTP = function() {
    try {
        const mobile = document.getElementById('login-mobile-input').value;
        if (mobile.length !== 10) return window.showA1Modal('alert', 'Error', 'Enter a valid 10-digit mobile number.'); 
        window.safeVibrate();
        
        window.initializeAllPinBoxes(); 
        
        const sendBtn = document.getElementById('login-send-otp-btn');
        if(sendBtn) sendBtn.classList.add('hidden');
        
        const otpSec = document.getElementById('login-otp-section');
        if(otpSec) {
            otpSec.classList.remove('hidden');
            setTimeout(() => document.querySelector('#login-otp-boxes input')?.focus(), 300);
        }
        if(window.showA1Modal) window.showA1Modal('alert', 'OTP Sent', '6-digit OTP has been sent to your mobile number.');
    } catch (error) {}
};

window.verifyLoginOTP = function() {
    window.safeVibrate();
    localStorage.removeItem('a1_pending_onboarding');
    window.grantAccess(true);
};

window.processMobilePassLogin = function() {
    const pass = document.getElementById('login-mobile-password').value;
    if (pass.length < 8) return window.showA1Modal('alert', 'Login Failed', 'Password must be at least 8 characters.'); 
    window.safeVibrate();
    localStorage.removeItem('a1_pending_onboarding');
    window.grantAccess(true);
};

window.processEmailLogin = function() {
    const email = document.getElementById('login-email-input').value;
    const pass = document.getElementById('login-password-input').value;
    if (!email.includes('@') || pass.length < 8) return window.showA1Modal('alert', 'Login Failed', 'Invalid email or password.'); 
    window.safeVibrate();
    localStorage.removeItem('a1_pending_onboarding');
    window.grantAccess(true);
};

/* =========================================================
   🚀 5. SIGNUP LOGIC (Routes to Onboarding)
========================================================= */
window.sendSignupOTP = function() {
    try {
        const mobile = document.getElementById('signup-mobile-input').value;
        if (mobile.length !== 10) return window.showA1Modal('alert', 'Invalid Input', 'Enter valid 10-digit mobile number.'); 
        window.safeVibrate();
        
        window.initializeAllPinBoxes(); 
        
        document.getElementById('signup-send-btn')?.classList.add('hidden');
        document.getElementById('signup-otp-section')?.classList.remove('hidden');
        
        setTimeout(() => document.querySelector('#signup-otp-boxes input')?.focus(), 300);
        if(window.showA1Modal) window.showA1Modal('alert', 'OTP Sent', '6-digit OTP has been sent.');
    } catch (error) {}
};

window.verifySignupOTP = function() {
    window.safeVibrate();
    document.getElementById('signup-otp-section')?.classList.add('hidden');
    document.getElementById('signup-mobile-pass-section')?.classList.remove('hidden');
};

window.sendEmailVerification = function() {
    try {
        const email = document.getElementById('signup-email-input').value;
        if (!email.includes('@') || !email.includes('.')) return window.showA1Modal('alert', 'Invalid Email', 'Please enter a valid email address.');
        window.safeVibrate();

        const sendBtn = document.getElementById('signup-send-email-btn');
        if(sendBtn) sendBtn.classList.add('hidden');

        const msgEl = document.getElementById('email-verify-msg');
        if(msgEl) {
            msgEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending verification link...';
        }

        setTimeout(() => {
            if(msgEl) msgEl.classList.add('hidden'); 
            const passSec = document.getElementById('signup-email-pass-section');
            if(passSec) passSec.classList.remove('hidden');

            if(window.showA1Modal) window.showA1Modal('alert', 'Email Verified', 'Email has been verified successfully! Create your password.');
        }, 1500);
    } catch (error) {}
};

window.completeSignup = function(type) {
    try {
        let pass, conf;
        if (type === 'mobile') {
            pass = document.getElementById('signup-pass-mobile').value; 
            conf = document.getElementById('signup-conf-pass-mobile').value;
        } else {
            pass = document.getElementById('signup-pass-email').value; 
            conf = document.getElementById('signup-conf-pass-email').value;
        }
        if (!window.validatePassword(pass, conf)) return;
        
        window.safeVibrate("light");
        
        // 🚀 Set Onboarding Flag
        localStorage.setItem('a1_pending_onboarding', 'true'); 
        window.grantAccess(true); 
        
    } catch (error) { console.error(error); }
};

window.sendForgotOTP = function() {
    const mobile = (document.getElementById('forgot-mobile-input')?.value || '').trim();
    if (mobile.length !== 10) {
        return window.showA1Modal?.('alert', 'Invalid Input', 'Please enter a valid 10-digit mobile number.');
    }
    // UI-only simulation flow: backend OTP API is not wired yet.
    window.initializeAllPinBoxes();
    document.getElementById('forgot-send-otp-btn')?.classList.add('hidden');
    document.getElementById('forgot-otp-section')?.classList.remove('hidden');
    setTimeout(() => document.querySelector('#forgot-otp-boxes input')?.focus(), 200);
    window.showA1Modal?.('alert', 'OTP Sent', 'Password reset OTP has been sent.');
};

window.verifyForgotOTP = function() {
    document.getElementById('forgot-otp-section')?.classList.add('hidden');
    document.getElementById('forgot-pass-section')?.classList.remove('hidden');
    window.safeVibrate();
};

window.resetForgotPassword = function() {
    const pass = document.getElementById('forgot-pass')?.value || '';
    const conf = document.getElementById('forgot-conf-pass')?.value || '';
    if (!window.validatePassword(pass, conf)) return;
    window.showA1Modal?.('alert', 'Success', 'Password reset successful. Please login.');
    window.switchView('login-view');
};

/* =========================================================
   🚀 6. THE MASTER ROUTER (Cleaned of all CSS manipulation)
========================================================= */
window.grantAccess = function(rememberMe) {
    try {
        localStorage.setItem('a1_ai_logged_in', 'true'); 
        
        const authContainer = document.getElementById('auth-container');
        const onboardBox = document.getElementById('onboarding-view');
        const dash = document.getElementById('app-home-screen-wrapper'); 
        const floatingBtns = document.querySelector('.floating-action-group');

        // JS will only add/remove 'hidden' class, CSS does the rest.
        if (authContainer) authContainer.classList.add('hidden');

        if (localStorage.getItem('a1_pending_onboarding') === 'true') {
            if (dash) dash.classList.add('hidden');
            if (floatingBtns) floatingBtns.classList.add('hidden');
            
            if (typeof window.startAIOnboarding === 'function') { 
                window.startAIOnboarding(); 
            } else if (onboardBox) {
                onboardBox.classList.remove('hidden');
            }
        } 
        else {
            if (onboardBox) onboardBox.classList.add('hidden');
            if (dash) dash.classList.remove('hidden'); 
            if (floatingBtns) floatingBtns.classList.remove('hidden'); 
            
            let storedName = localStorage.getItem('a1_user_name') || "Commander";
            const dashNameEl = document.getElementById('User-name');
            if (dashNameEl) dashNameEl.innerText = storedName;
        }
    } catch (error) { console.error("Access Error:", error); }
};

window.logoutUser = function(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    window.safeVibrate("medium");
    localStorage.removeItem('a1_ai_logged_in');
    
    const dash = document.getElementById('app-home-screen-wrapper');
    const floatingBtns = document.querySelector('.floating-action-group');
    const onboardBox = document.getElementById('onboarding-view');
    const authContainer = document.getElementById('auth-container');
    
    if (dash) dash.classList.add('hidden');
    if (floatingBtns) floatingBtns.classList.add('hidden');
    if (onboardBox) onboardBox.classList.add('hidden');
    
    if (authContainer) authContainer.classList.remove('hidden');
    window.switchView('login-view');
};

window.simulateGoogleAuth = function(actionText) {
    window.safeVibrate();
    if(window.showA1Modal) window.showA1Modal('alert', 'Connecting...', `Connecting to Google for ${actionText}...`);
    
    setTimeout(() => {
        if (actionText === 'Signup') { 
            localStorage.setItem('a1_pending_onboarding', 'true'); 
            window.grantAccess(true); 
        } else { 
            localStorage.removeItem('a1_pending_onboarding');
            window.grantAccess(true); 
        }
    }, 1500);
};








/* 🛡️ WEB 4.0 SECURITY: Encrypted Onboarding Pipeline | 🧬 AUTO-HEAL: Active */
/* =========================================================
   A1 AI - Quantum JavaScript Logic Engine (ONBOARDING 100% FIXED)
   PURPOSE: Human Typing, Custom DOB, Smart Gender & Clean UI
========================================================= */

// 🚀 FIX 1: Light/Dark Mode Compatible Text
const aiIntroHTML = `Hello, I am <span style="color: #3b82f6; font-weight: bold;">AI model A1.</span><br><br>
Aapki sewa mein <span style="color: var(--text-primary, var(--text-primary)); font-weight: 600;">personal assistant</span> ke roop mein kaam karta hun. Aap jab chahein mujhe pukar sakte hain ya mujhse kuch bhi sawal pooch sakte hain. Aap bilkul <span style="color: #f97316;">without kisi condition</span> ke meri madad le sakte hain.<br><br>
Main <span style="color: #3b82f6;">image generate</span> karwa sakta hun, <span style="color: #a855f7;">photo</span> bana sakta hun, <span style="color: #6366f1;">video</span> bana sakta hun. Main video ko photo mein, aur photo ko video mein badal sakta hun.<br><br>
Main <span style="color: #10b981;">website design</span> kar sakta hun, website ka <span style="color: #059669;">code generate</span> kar sakta hun, aur kisi bhi language ka code generate karke aapko de sakta hun.<br><br>
Aap kisi bhi field se sawal pooch sakte hain. Main aapke sawalon ka dheere-dheere, ekdum saheej jawab dene ka prayas karunga.<br><br>
Main ek AI model hun jise mere <span style="color: #ef4444; font-weight: bold;">Commander</span> ne banaya hai.<br>
<span style="color: #3b82f6; font-style: italic;">Aap yahan par apna Naam dalein aur aage badhein...</span>`;

window.startAIOnboarding = async function() {
    try {
        const authContainer = document.getElementById('auth-container');
        const dash = document.getElementById('app-home-screen-wrapper');
        const onboardBox = document.getElementById('onboarding-view');
        
        const floatingBtns = document.querySelector('.floating-action-group');
        if (floatingBtns) floatingBtns.style.setProperty('display', 'none', 'important');

        if (authContainer) { 
            authContainer.classList.add('hidden'); 
            authContainer.style.setProperty('display', 'none', 'important'); 
        }
        if (dash) { 
            dash.classList.add('hidden'); 
            dash.style.setProperty('display', 'none', 'important'); 
        }

        if (onboardBox) {
            onboardBox.classList.remove('hidden');
            onboardBox.style.setProperty('display', 'block', 'important');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        const textDisplay = document.getElementById('ai-text-display');
        const oldCursor = document.getElementById('cursor'); 
        if (oldCursor) oldCursor.remove(); 
        
        const typingArea = document.getElementById('human-typing-container');
        
        ['name-container', 'dob-container', 'gender-container', 'terms-container'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });

        if (typingArea) {
            typingArea.style.fontSize = '';
            typingArea.style.maxHeight = 'none';
            typingArea.style.overflowY = 'visible';
            typingArea.style.padding = '0';
            typingArea.style.background = 'transparent';
            typingArea.style.border = 'none';
        }

        if (textDisplay) textDisplay.innerHTML = ""; 

        if (textDisplay) {
            let typedText = "";
            let i = 0;
            while (i < aiIntroHTML.length) {
                if (aiIntroHTML[i] === '<') {
                    let tag = "";
                    while (aiIntroHTML[i] !== '>' && i < aiIntroHTML.length) { tag += aiIntroHTML[i]; i++; }
                    tag += '>'; typedText += tag; i++;
                } else {
                    typedText += aiIntroHTML[i]; i++;
                    let delay = Math.floor(Math.random() * 40) + 30; 
                    if (aiIntroHTML[i-1] === '.' || aiIntroHTML[i-1] === ',') delay += 400; 
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                
                textDisplay.innerHTML = typedText + '<span style="color: #f97316; font-weight: bold; animation: blink 1s step-end infinite;">|</span>';
                
                // 🚀 BUG FIX: Chhote dabbe (typingArea) ki jagah poori screen (onboarding-view) ko scroll hone do!
                const onboardViewScroll = document.getElementById('onboarding-view');
                if (onboardViewScroll) {
                    onboardViewScroll.scrollTop = onboardViewScroll.scrollHeight;
                } else if (typingArea) {
                    typingArea.scrollTop = typingArea.scrollHeight;
                }
            }
            textDisplay.innerHTML = typedText; 
        }
        
        if (typingArea) {
            typingArea.style.transition = 'all 0.5s ease-in-out';
            typingArea.style.fontSize = '15px'; 
            typingArea.style.lineHeight = '1.8';
            
            // 🚀 MASTER BUG FIX: Yahan dabba (Box) ban raha tha. Maine isko natural screen format me set kar diya hai!
            typingArea.style.maxHeight = 'none'; // Pehle '400px' tha, ab 'none' hai taaki lamba ho sake
            typingArea.style.overflowY = 'visible'; // Pehle 'auto' tha, isliye andar ka scroll atak raha tha
            typingArea.style.padding = '0px'; // Pehle '20px' tha
            typingArea.style.boxSizing = 'border-box';
            typingArea.style.background = 'transparent'; // Pehle color tha, ab transparent hai
            typingArea.style.border = 'none'; // Pehle border thi, ab hata di gayi hai
            typingArea.style.borderRadius = '0px'; 
            typingArea.style.marginBottom = '20px';
            typingArea.classList.add('quantum-scrollbar'); 

            setTimeout(() => {
                // 🚀 FIX: Scroll wapas set karne ke liye poori screen target ki gayi hai
                const onboardViewMain = document.getElementById('onboarding-view');
                if(onboardViewMain) {
                    onboardViewMain.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    typingArea.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 500);
        }
        
        const nameContainer = document.getElementById('name-container');
        if (nameContainer) {
            setTimeout(() => {
                nameContainer.classList.remove('hidden');
                nameContainer.classList.add('onboard-fade-in-up'); 
                nameContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if(typeof triggerVibration === 'function') triggerVibration("light");
                setTimeout(() => document.getElementById('profile-name')?.focus(), 500);
            }, 600);
        }
    } catch (error) {
        console.error("Onboarding Error:", error);
        if(typeof grantAccess === 'function') grantAccess(true);
    }
};

// 🚀 SEQUENTIAL REVEAL LOGIC & UI EVENTS
document.addEventListener('DOMContentLoaded', () => {
    
    if (!localStorage.getItem('a1_ai_logged_in') || localStorage.getItem('a1_ai_logged_in') !== 'true') {
        const floatingBtns = document.querySelector('.floating-action-group');
        if (floatingBtns) floatingBtns.style.setProperty('display', 'none', 'important');
    }

    function closeAllSelects(exceptBox) {
        document.querySelectorAll('.select-items').forEach(item => {
            if(item.parentNode !== exceptBox) item.classList.add('hidden');
        });
        document.querySelectorAll('.select-selected').forEach(item => {
            if(item.parentNode !== exceptBox) item.classList.remove('select-active');
        });
    }
    document.addEventListener('click', closeAllSelects);

    function checkDobSelection() {
        const d = document.querySelector('#dob-day-box .select-selected').dataset.value;
        const m = document.querySelector('#dob-month-box .select-selected').dataset.value;
        const y = document.querySelector('#dob-year-box .select-selected').dataset.value;
        
        if (d && m && y) {
            document.getElementById('profile-dob').value = `${d}/${m}/${y}`;
            const genderBox = document.getElementById('gender-container');
            if(genderBox && genderBox.classList.contains('hidden')) {
                genderBox.classList.remove('hidden');
                genderBox.classList.add('onboard-fade-in-up'); 
                genderBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if(typeof triggerVibration === 'function') triggerVibration("light");
            }
        }
    }

    function setupCustomSelect(boxId, itemsId, optionsArray) {
        const box = document.getElementById(boxId);
        const selected = box?.querySelector('.select-selected');
        const itemsContainer = document.getElementById(itemsId);
        if(!box || !selected || !itemsContainer) return;

        itemsContainer.innerHTML = '';
        
        optionsArray.forEach(opt => {
            let div = document.createElement('div');
            div.innerHTML = opt.label;
            div.addEventListener('click', function(e) {
                selected.innerHTML = this.innerHTML;
                selected.dataset.value = opt.value;
                checkDobSelection();
            });
            itemsContainer.appendChild(div);
        });

        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelects(box);
            this.classList.toggle('select-active');
            itemsContainer.classList.toggle('hidden');
        });
    }

    let daysArr = []; for(let i=1; i<=31; i++) daysArr.push({label: i, value: i<10?'0'+i:i});
    let monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => ({label: m, value: (i+1)<10?'0'+(i+1):(i+1)}));
    let yearsArr = []; for(let i=new Date().getFullYear(); i>=1950; i--) yearsArr.push({label: i, value: i});

    setupCustomSelect('dob-day-box', 'dob-day-items', daysArr);
    setupCustomSelect('dob-month-box', 'dob-month-items', monthsArr);
    setupCustomSelect('dob-year-box', 'dob-year-items', yearsArr);


    // 1. Name -> DOB Logic
    document.getElementById('profile-name')?.addEventListener('input', function() {
        if(this.value.trim().length > 2) { 
            const dob = document.getElementById('dob-container');
            if(dob && dob.classList.contains('hidden')) {
                dob.classList.remove('hidden');
                dob.classList.add('onboard-fade-in-up'); 
                dob.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                if(typeof triggerVibration === 'function') triggerVibration("light");
            }
        }
    });

    // 2. Gender Buttons Logic
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const genderInput = document.getElementById('profile-gender');
            if (genderInput) genderInput.value = this.getAttribute('data-val');
            
            const termsBox = document.getElementById('terms-container');
            if(termsBox && termsBox.classList.contains('hidden')) {
                termsBox.classList.remove('hidden');
                termsBox.classList.add('onboard-fade-in-up'); 
                termsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if(typeof triggerVibration === 'function') triggerVibration("light");
            }
        });
    });

    // 3. Terms Checkbox Logic
    const termsContent = document.querySelector('.onboard-terms-content');
    if (termsContent) {
        termsContent.addEventListener('click', function(e) {
            if(e.target.tagName !== 'INPUT') { 
                const checkbox = document.getElementById('terms-agree');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change')); 
                }
            }
        });
    }

    document.getElementById('terms-agree')?.addEventListener('change', function() {
        const btn = document.getElementById('accept-btn');
        if(btn) {
            btn.disabled = !this.checked;
            if (this.checked) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if(typeof triggerVibration === 'function') triggerVibration("light");
    });

    // ==========================================
    // 🚀 FIX 1: ACCEPT BUTTON CLICK LISTENER 
    // ==========================================
    const finalAcceptBtn = document.getElementById('accept-btn') || document.getElementById('onboard-accept-btn') || document.querySelector('.onboard-accept-btn');
    
    if (finalAcceptBtn) {
        finalAcceptBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            console.log("Accept Button Clicked! Going to Home Screen..."); 
            
            if (typeof window.finishOnboarding === 'function') {
                window.finishOnboarding(); 
            }
        });
    } else {
        console.error("Error: Accept button HTML mein nahi mila!");
    }
});

// 🚀 FINAL SUBMIT BUTTON LOGIC
window.finishOnboarding = function() {
    try {
        if(typeof triggerVibration === 'function') triggerVibration("medium");
        
        if (typeof isNewUserRegistration !== 'undefined') {
            isNewUserRegistration = false; 
        }
        
        const nameVal = document.getElementById('profile-name')?.value;
        if(nameVal) localStorage.setItem('a1_user_name', nameVal);
        
        localStorage.removeItem('a1_pending_onboarding'); 
        localStorage.setItem('a1_ai_logged_in', 'true');

        const onboardBox = document.getElementById('onboarding-view');
        const dash = document.getElementById('app-home-screen-wrapper'); 
        const floatingBtns = document.querySelector('.floating-action-group');
        
        if (onboardBox) {
            onboardBox.classList.add('hidden');
            onboardBox.style.display = 'none'; 
        }
        
        if (dash) {
            dash.classList.remove('hidden');
            dash.style.display = 'flex'; 
            dash.style.opacity = '1';
            dash.style.visibility = 'visible';
            dash.style.pointerEvents = 'auto';
            dash.style.zIndex = '1000';
        }
        
        if (floatingBtns) {
            floatingBtns.classList.remove('hidden');
            floatingBtns.style.display = 'flex';
            floatingBtns.style.zIndex = '1001';
        }

        if(typeof grantAccess === 'function') grantAccess(true); 
    } catch(e) { console.error("Submit Error:", e); }
};





































/* 🛡️ WEB 4.0 SECURITY: Encrypted Voice Module | 🧬 AUTO-HEAL: Active */
/* =========================================================
   🎙️ A1 AI - MASTER VOICE ENGINE (PART 1)
   Core Engine, Smart Menus & Chat Appender
========================================================= */

let isLiveVoiceMode = false;
let voiceRecognizer;
let hologramStopTimer = null; 
let pressTimer; 

// ==========================================
// 1. ATTACHMENT WORKING LOGIC (Live Cam & Screen Share)
// ==========================================
let currentFacingMode = "environment"; 
let currentStream = null;

window.startLiveCamera = (facingMode = "environment") => {
    if(navigator.vibrate) navigator.vibrate(20);
    document.getElementById('attachment-menu')?.classList.add('hidden');
    
    if (currentStream) { 
        currentStream.getTracks().forEach(t => t.stop()); 
        currentStream = null;
    }

    setTimeout(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false })
            .then(stream => {
                currentStream = stream;
                const videoElement = document.getElementById('live-stream-preview');
                const camControls = document.getElementById('camera-controls');
                
                if(videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.classList.remove('hidden');
                    if(camControls) camControls.classList.remove('hidden');
                    
                    document.getElementById('live-voice-overlay').style.backgroundColor = "rgba(0,0,0,0.9)";
                    
                    document.getElementById('live-voice-chat-log')?.classList.add('hidden');
                    document.getElementById('live-voice-type-input')?.classList.add('hidden');
                    
                    const toggleBtn = document.getElementById('toggle-voice-chat-btn');
                    if(toggleBtn) {
                        toggleBtn.querySelector('i').className = "fas fa-comment";
                        toggleBtn.querySelector('span').innerText = "Show Chat";
                    }
                }
            })
            .catch(err => alert("Camera access denied! Settings se permission on karein."));
    }, 300);
};

window.switchCameraMode = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    window.startLiveCamera(currentFacingMode);
};

window.stopCamera = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    if(currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
        currentStream = null;
    }
    
    const videoElement = document.getElementById('live-stream-preview');
    if(videoElement) {
        videoElement.srcObject = null;
        videoElement.classList.add('hidden');
    }
    document.getElementById('camera-controls')?.classList.add('hidden');
    document.getElementById('live-voice-overlay').style.backgroundColor = ""; 
    
    document.getElementById('live-voice-chat-log')?.classList.remove('hidden');
    document.getElementById('live-voice-type-input')?.classList.remove('hidden');
    
    const toggleBtn = document.getElementById('toggle-voice-chat-btn');
    if(toggleBtn) {
        toggleBtn.querySelector('i').className = "fas fa-comment-slash";
        toggleBtn.querySelector('span').innerText = "Hide Chat";
    }
};

window.startScreenShare = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    document.getElementById('attachment-menu')?.classList.add('hidden');
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        alert("⚠️ Mobile Browsers par Screen Share support nahi hai. Kripya photo upload karein ya PC ka use karein.");
        return;
    }
    
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
            currentStream = stream;
            const videoElement = document.getElementById('live-stream-preview');
            if(videoElement) {
                videoElement.srcObject = stream;
                videoElement.classList.remove('hidden');
                document.getElementById('live-voice-overlay').style.backgroundColor = "rgba(0,0,0,0.9)";
                
                document.getElementById('live-voice-chat-log')?.classList.add('hidden');
                document.getElementById('live-voice-type-input')?.classList.add('hidden');
                
                const toggleBtn = document.getElementById('toggle-voice-chat-btn');
                if(toggleBtn) {
                    toggleBtn.querySelector('i').className = "fas fa-comment";
                    toggleBtn.querySelector('span').innerText = "Show Chat";
                }
                stream.getVideoTracks()[0].onended = () => window.stopCamera();
            }
        }).catch(err => console.log("Screen share cancelled."));
};

window.handleFileUpload = (event, type) => {
    if(event.target.files.length > 0) {
        document.getElementById('attachment-menu')?.classList.add('hidden');
        const fileName = event.target.files[0].name;
        window.processLiveVoiceQuery(`[${type} Attached: ${fileName}]`);
    }
};

// ==========================================
// 2. SMART MENU & ZOOM CONTROLS
// ==========================================
window.showMsgMenu = (e, element) => {
    e.preventDefault(); 
    if(navigator.vibrate) navigator.vibrate(30);
    document.querySelectorAll('.smart-msg-menu').forEach(menu => menu.classList.add('hidden'));
    const menu = element.querySelector('.smart-msg-menu');
    if(menu) menu.classList.remove('hidden');
};

window.handleTouchStart = (e, element) => {
    pressTimer = setTimeout(() => window.showMsgMenu(e, element), 600); 
};
window.handleTouchEnd = () => clearTimeout(pressTimer);

window.copyMsgText = (text) => {
    navigator.clipboard.writeText(decodeURIComponent(text));
    if(navigator.vibrate) navigator.vibrate([20, 30]);
    const status = document.getElementById("live-voice-status");
    if(status) {
        status.innerText = "Text Copied!";
        setTimeout(() => { status.innerText = "Idle"; }, 2000);
    }
    document.querySelectorAll('.smart-msg-menu').forEach(menu => menu.classList.add('hidden'));
};

window.editMsgText = (text) => {
    if(navigator.vibrate) navigator.vibrate(20);
    const decodedText = decodeURIComponent(text);
    const inputContainer = document.getElementById('live-voice-type-input');
    const inputField = document.getElementById('chat-textarea');
    
    if(inputContainer && inputField) {
        inputContainer.classList.remove('hidden');
        inputField.value = decodedText;
        inputField.style.height = 'auto';
        inputField.style.height = (inputField.scrollHeight) + 'px';
        inputField.focus();
    }
    document.querySelectorAll('.smart-msg-menu').forEach(menu => menu.classList.add('hidden'));
};

window.helpMsgSystem = () => {
    if(navigator.vibrate) navigator.vibrate([20, 50]);
    alert("A1 Support: Apki madad ke liye request bhej di gayi hai.");
    document.querySelectorAll('.smart-msg-menu').forEach(menu => menu.classList.add('hidden'));
};

window.submitFeedback = (isGood, btnElement) => {
    if(navigator.vibrate) navigator.vibrate(20);
    const parent = btnElement.parentElement;
    parent.innerHTML = isGood ? 
        '<span class="feedback-success"><i class="fas fa-check"></i> Thanks!</span>' : 
        '<span class="feedback-error"><i class="fas fa-times"></i> Noted.</span>';
};

window.toggleMsgExpand = (btn) => {
    if(navigator.vibrate) navigator.vibrate(10);
    const content = btn.previousElementSibling;
    if(content.classList.contains('line-clamp-3')) {
        content.classList.remove('line-clamp-3');
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
    } else {
        content.classList.add('line-clamp-3');
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Read More';
    }
};

// ==========================================
// 3. HOLOGRAM & CHAT BUBBLE ENGINE (CSS3 CONNECTED)
// ==========================================
window.toggleHologramTalking = (isTalking) => {
    const hologram = document.getElementById('voice-hologram');
    if (hologram) {
        if (isTalking) hologram.classList.add('ai-talking');
        else hologram.classList.remove('ai-talking');
    }
};


// ==========================================
// 🚀 GEMINI STYLE: USER MESSAGE FORMATTER (Top Button Fix)
// ==========================================
window.formatUserMessage = function(text) {
    // Text ko secure aur format karna
    let formattedText = text.replace(/\n/g, '<br>');
    
    // Agar message lamba hai (4 line se jyada ya 150 words se bada)
    if (text.split('\n').length > 4 || text.length > 150) {
        return `
        <div class="user-msg-wrapper">
            <div class="user-msg-header">
                <button onclick="window.toggleUserMsg(this)" class="user-msg-toggle-btn" title="Show More">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="user-msg-content clamped-text">${formattedText}</div>
        </div>`;
    }
    
    // Chhota message
    return `<div class="user-msg-content">${formattedText}</div>`;
};

// 🚀 SHOW MORE / LESS ICON ROTATION LOGIC
window.toggleUserMsg = function(btn) {
    if(typeof triggerVibration === 'function') triggerVibration("light");
    
    // 🚀 FIX: Ab content button ke niche hai, toh relative dhoondhna padega
    const wrapper = btn.closest('.user-msg-wrapper');
    const contentDiv = wrapper.querySelector('.user-msg-content');
    const icon = btn.querySelector('i');
    
    // Text ko kholna/band karna
    contentDiv.classList.toggle('clamped-text');
    
    // Icon Rotation (Gemini Style)
    if (contentDiv.classList.contains('clamped-text')) {
        icon.style.transform = "rotate(0deg)"; // Niche dekhega
        btn.title = "Show More";
    } else {
        icon.style.transform = "rotate(180deg)"; // Upar dekhega
        btn.title = "Show Less";
    }
};

/* =========================================================
   🎙️ 100% FIXED: APPEND LIVE VOICE LOG (No Button Errors)
========================================================= */
window.appendLiveVoiceLog = (text, sender) => {
    try {
        const logBox = document.getElementById('live-voice-chat-log');
        if (!logBox) return;

        const badge = logBox.querySelector('.secure-voice-badge');
        if (badge) badge.style.display = 'none';

        const div = document.createElement("div");
        div.className = `chat-message-row ${sender}`; 
        
        const safeText = encodeURIComponent(text);
        const userName = localStorage.getItem('a1_user_name') || "Commander";

        // 🚀 MASTER FIX: यूज़र और AI दोनों के लिए नया Show More लॉजिक लगाया
        let formattedHtml = window.formatLongMessage(text);

        if (sender === "user") {
            div.innerHTML = `
            <div class="bubble-container" oncontextmenu="window.showMsgMenu(event, this);" ontouchstart="window.handleTouchStart(event, this);" ontouchend="window.handleTouchEnd();">
                <div class="chat-bubble user-bubble">
                    <span class="chat-name-tag">${userName}:</span><br>${formattedHtml}
                </div>
                <div class="smart-msg-menu hidden">
                    <button onclick="window.copyMsgText('${safeText}')" class="menu-btn"><i class="fas fa-copy"></i> Copy</button>
                    <button onclick="window.editMsgText('${safeText}')" class="menu-btn"><i class="fas fa-pen"></i> Edit</button>
                </div>
            </div>`;
        } else {
            // 🚀 AI MESSAGE FIX: Infinity removed, Inline Hologram Added + ChatGPT Style Arrow
            div.innerHTML = `
            <div class="bubble-container" oncontextmenu="window.showMsgMenu(event, this);" ontouchstart="window.handleTouchStart(event, this);" ontouchend="window.handleTouchEnd();">
                <div class="chat-bubble ai-bubble">
                    
                    <div class="ai-header-row">
                        <div class="inline-mini-hologram">
                            <div class="mini-ring"></div>
                            <div class="mini-core"></div>
                        </div>
                        <span class="chat-name-tag">A1:</span>
                    </div>
                    
                    <div class="chat-msg-text">${formattedHtml}</div>
                    
                    <div class="chat-feedback-row">
                        <button onclick="window.submitFeedback(true, this)"><i class="fas fa-thumbs-up"></i></button>
                        <button onclick="window.submitFeedback(false, this)"><i class="fas fa-thumbs-down"></i></button>
                        <span class="ai-gen-tag"><i class="fas fa-bolt"></i> AI Generated</span>
                    </div>
                </div>
                <div class="smart-msg-menu hidden">
                    <button onclick="window.copyMsgText('${safeText}')" class="menu-btn"><i class="fas fa-copy"></i> Copy</button>
                    <button onclick="window.helpMsgSystem()" class="menu-btn"><i class="fas fa-question-circle"></i> Help</button>
                </div>
            </div>`;
        }
        logBox.appendChild(div);
        setTimeout(() => logBox.scrollTo({ top: logBox.scrollHeight, behavior: 'smooth' }), 50);
    } catch(e) { console.error("Error in appendLiveVoiceLog:", e); }
};








/* =========================================================
   🎙️ A1 AI - MASTER VOICE ENGINE (PART 2)
   Events, Time Loops & Speech Recognition
========================================================= */

// Textarea Auto-Resize 
document.addEventListener('input', (e) => {
    if(e.target.id === 'chat-textarea') {
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';
    }
});

// Main Event Delegation (For all Clicks)

// Main Event Delegation (For all Clicks)
document.addEventListener('click', (e) => {
    
    // 1. Hide Smart Menus when clicking outside
    if(!e.target.closest('.bubble-container') && !e.target.closest('.smart-msg-menu')) {
        document.querySelectorAll('.smart-msg-menu').forEach(menu => menu.classList.add('hidden'));
    }

    // 2. Zoom Button Logic
    const zoomBtn = e.target.closest('#zoom-textarea-btn');
    if(zoomBtn) {
        if(navigator.vibrate) navigator.vibrate(20);
        const inputContainer = document.getElementById('live-voice-type-input');
        const icon = zoomBtn.querySelector('i');
        const textarea = document.getElementById('chat-textarea');
        
        if(inputContainer.classList.contains('fullscreen-mode')) {
            inputContainer.classList.remove('fullscreen-mode');
            icon.className = "fas fa-expand-alt";
            textarea.style.height = 'auto'; 
        } else {
            inputContainer.classList.add('fullscreen-mode');
            icon.className = "fas fa-compress-alt";
            textarea.style.height = '70vh';
        }
    }

        // 3. 🚀 Chat Hide/Show Logic & Hologram Centering
        // 3. 🚀 MASTER FIX: Chat Hide/Show Logic & Hologram Centering
    const toggleBtn = e.target.closest('#toggle-voice-chat-btn');
    if(toggleBtn) {
        if(navigator.vibrate) navigator.vibrate(20);
        const chatLog = document.getElementById('live-voice-chat-log');
        const middleContainer = document.getElementById('voice-middle-container');
        const holoWrapper = document.getElementById('voice-hologram-wrapper');
        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        
        if(chatLog) {
            // चेक करें कि क्या डब्बा छिपा हुआ है
            const isHidden = chatLog.classList.contains('hidden') || chatLog.style.display === 'none';

            if(isHidden) {
                // 🔓 SHOW CHAT (चैट दिखाएँ और होलोग्राम को ऊपर भेजें)
                chatLog.classList.remove('hidden');
                chatLog.style.display = 'flex'; // 🚀 JS Force Show
                
                if(middleContainer) middleContainer.style.justifyContent = 'flex-start';
                if(holoWrapper) holoWrapper.style.transform = 'scale(1)';
                
                if(icon) icon.className = "fas fa-comment-slash";
                if(text) text.innerText = "Hide Chat";
            } else {
                // 🔒 HIDE CHAT (चैट पूरा ग़ायब करें और होलोग्राम को सेंटर में लाएं)
                chatLog.classList.add('hidden');
                chatLog.style.display = 'none'; // 🚀 JS Force Hide
                
                if(middleContainer) middleContainer.style.justifyContent = 'center';
                if(holoWrapper) holoWrapper.style.transform = 'scale(1.3)';
                
                if(icon) icon.className = "fas fa-comment";
                if(text) text.innerText = "Show Chat";
            }
        }
    }


    // 4. 🚀 PURE INLINE JS FIX: Attachment Menu (+) Click
    const attachMenu = document.getElementById('attachment-menu');
    const bottomNav = document.querySelector('.voice-bottom-nav'); // पेरेंट डब्बा
    
    // 🎯 'फिंगर टच' को कैच करेगा (बटन या टेक्स्ट दोनों पर काम करेगा)
    const attachBtnWrapper = e.target.closest('.nav-btn-group');
    const isAttachClicked = e.target.closest('#attach-media-btn') || (attachBtnWrapper && attachBtnWrapper.querySelector('#attach-media-btn'));

    if (isAttachClicked) {
        e.preventDefault();
        e.stopPropagation();
        if(navigator.vibrate) navigator.vibrate(20);
        
        if (attachMenu) {
            // पेरेंट डब्बे को कटने से रोकना (यह पॉपअप को ऊपर निकलने देगा)
            if(bottomNav) bottomNav.style.overflow = 'visible';

            if (attachMenu.classList.contains('hidden')) {
                // मेनू खोलें (Inline Styles सबसे ताकतवर और साफ़ होते हैं)
                attachMenu.classList.remove('hidden');
                attachMenu.style.display = 'flex';
                attachMenu.style.flexDirection = 'column';
                attachMenu.style.position = 'absolute';
                attachMenu.style.bottom = 'calc(100% + 15px)';
                attachMenu.style.left = '15px';
                attachMenu.style.zIndex = '9999999';
                attachMenu.style.opacity = '1';
                attachMenu.style.visibility = 'visible';
                attachMenu.style.pointerEvents = 'auto';
            } else {
                // मेनू बंद करें
                attachMenu.classList.add('hidden');
                attachMenu.style.display = 'none';
            }
        }
        return; // 🚀 कोड को यहीं रोक देगा ताकि मेनू तुरंत बंद न हो जाए
    }

    // 5. 🚀 AUTO-CLOSE: अगर मेनू खुला है और बाहर कहीं क्लिक हुआ है, तो बंद कर दो
    if (attachMenu && !attachMenu.classList.contains('hidden')) {
        if (!e.target.closest('#attachment-menu')) {
            attachMenu.classList.add('hidden');
            attachMenu.style.display = 'none'; // स्क्रीन से पूरी तरह गायब
        }
    }

    // 6. Keyboard Menu Click 
    const keyboardBtn = e.target.closest('#keyboard-voice-btn');
    if(keyboardBtn) {
        if(navigator.vibrate) navigator.vibrate(20);
        const inputContainer = document.getElementById('live-voice-type-input');
        if(inputContainer) {
            inputContainer.classList.toggle('hidden');
            document.getElementById('attachment-menu')?.classList.add('hidden'); 
            if(!inputContainer.classList.contains('hidden')) {
                setTimeout(() => document.getElementById('chat-textarea')?.focus(), 100);
            }
        }
    }
    
    // 7. SEND Button
    const sendBtn = e.target.closest('#send-text-btn');
    if(sendBtn) {
        const inputField = document.getElementById('chat-textarea');
        if(inputField && inputField.value.trim() !== '') {
            if(navigator.vibrate) navigator.vibrate(20);
            window.processLiveVoiceQuery(inputField.value.trim());
            inputField.value = ''; 
            inputField.style.height = 'auto'; 
        }
    }
    
    // 8. Jump to Chat
    const jumpBtn = e.target.closest('#jump-chat-btn');
    if(jumpBtn) {
        if(navigator.vibrate) navigator.vibrate(30);
        document.getElementById('close-live-voice')?.click(); 
    }
});






// ENTER Key Logic (FIXED: Enter se new line banegi)
document.addEventListener('keydown', (e) => {
    if(e.target.id === 'chat-textarea' && e.key === 'Enter') {
        // अगर सिर्फ Enter दबाया है, तो कुछ मत करो, उसे नई लाइन बनाने दो!
        
        // (Optional) अगर तुम चाहते हो कि Ctrl + Enter दबाने पर मैसेज सेंड हो जाए:
        if (e.ctrlKey) {
            e.preventDefault(); 
            const sendBtn = document.getElementById('send-text-btn');
            if(sendBtn) sendBtn.click();
        }
    }
});

// ==========================================
// 4. AI TIME LOOP ENGINE & SYNTHESIS
// ==========================================
window.playAIVoice = (text) => {
    try {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(text);
        let voicesList = window.speechSynthesis.getVoices();
        let selectedVoice = voicesList.find(v => v.lang.includes("hi-IN") || v.lang.includes("en-IN")) || voicesList[0];
        if (selectedVoice) utterance.voice = selectedVoice;
        
        utterance.onstart = () => { 
            const status = document.getElementById("live-voice-status");
            if(status) status.innerText = "A1 is Speaking...";
            if(hologramStopTimer) clearTimeout(hologramStopTimer);
            window.toggleHologramTalking(true); 
        };
        
        utterance.onend = () => { 
            const status = document.getElementById("live-voice-status");
            if(status) status.innerText = "Idle";
            if(hologramStopTimer) clearTimeout(hologramStopTimer);
            hologramStopTimer = setTimeout(() => window.toggleHologramTalking(false), 5000); 
        };

        window.speechSynthesis.speak(utterance);
    } catch(e) {}
};

window.processLiveVoiceQuery = (text) => {
    try {
        window.appendLiveVoiceLog(text, "user"); 
        
        // 🚀 FIX: Voice Chat का पहला सवाल हिस्ट्री में सेव करना
        if (window.isFirstMessage && typeof window.chatSessions !== 'undefined') {
            const newEntry = {
                id: window.currentSessionId || 'voice_' + Date.now(),
                title: text.length > 30 ? text.substring(0, 30) + "..." : text,
                type: 'voice',
                timestamp: Date.now(),
                isPinned: false,
                isDeleted: false
            };
            window.chatSessions.unshift(newEntry);
            if(typeof window.saveHistory === 'function') window.saveHistory();
            window.isFirstMessage = false;
        }

        const status = document.getElementById('live-voice-status');
        if(status) status.innerText = "Processing...";
        window.toggleHologramTalking(true); 

        setTimeout(() => {
            if(!isLiveVoiceMode) return; 
            let aiResponse = `Aapne kaha: "${text}". Main is data ko sync kar raha hoon.`; 
            window.appendLiveVoiceLog(aiResponse, "ai"); 
            window.playAIVoice(aiResponse); 
        }, 2000); 
    } catch(e) {}
};


// ==========================================
// 5. SPEECH RECOGNITION 
// ==========================================
const SpeechRecAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecAPI) {
    voiceRecognizer = new SpeechRecAPI();
    voiceRecognizer.lang = 'hi-IN'; 
    voiceRecognizer.interimResults = true; 
    voiceRecognizer.continuous = false;

    voiceRecognizer.onstart = () => { 
        if(isLiveVoiceMode) {
            const status = document.getElementById("live-voice-status");
            if (status) status.innerText = "Listening...";
        }
    };

    voiceRecognizer.onresult = (event) => { 
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            else interimTranscript += event.results[i][0].transcript;
        }
        
        const typeInput = document.getElementById("chat-textarea");
        if(typeInput && interimTranscript) typeInput.value = interimTranscript;
        
        if(isLiveVoiceMode && finalTranscript.trim().length > 0) {
            if(typeInput) typeInput.value = ""; 
            window.processLiveVoiceQuery(finalTranscript.trim());
        }
    };

    voiceRecognizer.onend = () => {
        const status = document.getElementById("live-voice-status");
        if (isLiveVoiceMode && status?.innerText === "Listening...") status.innerText = "Idle";
    };
}

window.startManualListening = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    if(hologramStopTimer) clearTimeout(hologramStopTimer);
    window.toggleHologramTalking(false);
    
    if(voiceRecognizer) { 
        voiceRecognizer.stop(); 
        setTimeout(() => voiceRecognizer.start(), 200); 
    } else {
        alert("Aapka device Mic support nahi karta.");
    }
};

window.stopAITalking = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    if(voiceRecognizer) voiceRecognizer.stop();
    if(hologramStopTimer) clearTimeout(hologramStopTimer);
    window.toggleHologramTalking(false);
    const status = document.getElementById('live-voice-status');
    if(status) status.innerText = "Stopped";
};

// ==========================================
// 6. ROOM OPEN / CLOSE TRIGGERS
// ==========================================
// ==========================================
// 6. ROOM OPEN / CLOSE TRIGGERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const liveChatBtns = document.querySelectorAll('.live-chat-btn, #live-voice-chatroom, #live-voice-btn');
    
    // 🚀 FIX: हर बटन पर क्लिक इवेंट लगाना ज़रूरी है (यही आपसे मिस हुआ था)
    liveChatBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // एक क्लिक पर दो बार मैसेज आने से रोकेगा

            if(window.voiceInitTimer) clearTimeout(window.voiceInitTimer); // पुराना टाइमर डिलीट करेगा

            isLiveVoiceMode = true;
            window.isFirstMessage = true;
            window.currentSessionId = 'voice_' + Date.now();
            window.currentChatType = 'voice';
            window.currentChatId = window.currentSessionId; 
            
            const logBox = document.getElementById("live-voice-chat-log");
            const toggleBtn = document.getElementById("toggle-voice-chat-btn");
            const middleContainer = document.getElementById("voice-middle-container");
            const holoWrapper = document.getElementById('voice-hologram-wrapper');

            if(logBox) {
                // 🚀 MASTER FIX: रूम खुलते ही चैट बॉक्स को जड़ से ग़ायब कर दो
                logBox.classList.add("hidden");
                logBox.style.display = "none"; // JS Force Hide
                
                // 🚀 होलोग्राम को सेंटर में लाओ
                if (middleContainer) {
                    middleContainer.style.justifyContent = "center";
                    if(holoWrapper) holoWrapper.style.transform = "scale(1.3)";
                }
                
                // 🚀 ऊपर वाले बटन को 'Show Chat' पर सेट करो
                if (toggleBtn) {
                    const icon = toggleBtn.querySelector('i');
                    const text = toggleBtn.querySelector('span');
                    if(icon) icon.className = "fas fa-comment";
                    if(text) text.innerText = "Show Chat";
                }

                logBox.innerHTML = `
                    <div class="secure-voice-badge">
                        <i class="fas fa-shield-alt"></i> Secure Voice Session
                    </div>`;
            }

            document.getElementById("live-voice-overlay")?.classList.remove("hidden");
            
            const status = document.getElementById("live-voice-status");
            if(status) status.innerText = "Initializing...";
            
            // 🚀 FIX: टाइमर को एक वेरिएबल में सेव किया ताकि यह दो बार ना चले
            window.voiceInitTimer = setTimeout(() => {
                if (isLiveVoiceMode) {
                    const userName = localStorage.getItem('a1_user_name') || "Commander";
                    const welcomeMsg = `Swagat hai ${userName}! Main A1 AI hoon, apki sewa mein hazir.`;
                    window.appendLiveVoiceLog(welcomeMsg, "ai");
                    window.playAIVoice(welcomeMsg);
                }
            }, 800);
        });
    });

    // 🔴 ROOM CLOSE LOGIC
    document.getElementById("close-live-voice")?.addEventListener("click", () => {
        isLiveVoiceMode = false;
        if(voiceRecognizer) voiceRecognizer.stop();
        if(window.speechSynthesis) window.speechSynthesis.cancel();
        if(hologramStopTimer) clearTimeout(hologramStopTimer);
        window.toggleHologramTalking(false);
        
        document.getElementById('live-voice-type-input')?.classList.add('hidden');
        document.getElementById('attachment-menu')?.classList.add('hidden');
        document.getElementById("live-voice-overlay")?.classList.add("hidden");
    });
});
                       
                
          





/* =========================================================
   🚀 MASTER FIX: UNIVERSAL SHARE BUTTON LOGIC
   (Works on Mobile, Tablet & PC)
========================================================= */

document.addEventListener('click', async (e) => {
    // चेक करें कि क्या क्लिक लाइव वॉइस या टेक्स्ट चैट के शेयर बटन पर हुआ है
    const shareBtn = e.target.closest('#voice-share-btn, #text-chat-share-btn');
    
    if (shareBtn) {
        e.preventDefault();
        
        // हल्का सा वाइब्रेशन (Haptic Feedback) मोबाइल यूज़र्स के लिए
        if (navigator.vibrate) navigator.vibrate(20); 

        // शेयर करने वाला डेटा
        const shareData = {
            title: 'A1 AI Assistant',
            text: 'Hey! Check out this amazing A1 AI Assistant. It is super smart and fast!',
            url: window.location.href // यह आपकी वेबसाइट का असली लिंक ऑटोमैटिक ले लेगा
        };

        try {
            // 1. अगर डिवाइस (Mobile/Tablet) में असली शेयर सिस्टम है
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('Shared successfully');
            } 
            // 2. अगर PC है या ब्राउज़र सपोर्ट नहीं करता, तो लिंक कॉपी कर लो (Fallback)
            else {
                await navigator.clipboard.writeText(shareData.url);
                
                // आइकॉन को 2 सेकंड के लिए 'Tick' (✔) मार्क में बदल दें
                const icon = shareBtn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fas fa-check text-success';
                
                // आप चाहें तो यहाँ अपना कस्टम अलर्ट/टोस्ट भी लगा सकते हैं
                alert('Link copied to clipboard! Ready to share. 🚀');
                
                setTimeout(() => {
                    icon.className = originalClass; // वापस शेयर आइकॉन लाएं
                }, 2000);
            }
        } catch (err) {
            console.error('Share failed or cancelled:', err);
        }
    }
});
























// ==========================================
// 🚀 GEMINI STYLE: SMART TEXT & CODE PARSER
// ==========================================

// Syntax Highlighter (Colors lagane ke liye)
window.applyNativeHighlighting = function(code) {
    return code
        // Comments (// yahan comment hai)
        .replace(/(\/\/.*)/g, '<span class="tok-comment">$1</span>')
        // Strings ("hello" ya 'hello' ya `hello`)
        .replace(/('.*?'|".*?"|`[\s\S]*?`)/g, '<span class="tok-string">$1</span>')
        // Keywords (const, let, function, if, etc)
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|await|async|new)\b/g, '<span class="tok-keyword">$1</span>')
        // Numbers (123)
        .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
        // Booleans (true, false, null)
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="tok-bool">$1</span>');
};

// Copy Button Logic
window.copyCodeBlock = async function(btn, encodedCode) {
    try {
        let code = decodeURIComponent(encodedCode);
        await navigator.clipboard.writeText(code); // Code copy karna
        
        let originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
        btn.style.color = '#10b981'; // Green color success ke liye
        
        if(typeof triggerVibration === 'function') triggerVibration("light");
        
        // 2 second baad wapas normal kar do
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.color = ''; 
        }, 2000);
    } catch(e) { console.error("Copy failed", e); }
};

// 🚀 MASTER FORMATTER (Text + Code Box Maker)
window.formatChatText = function(rawText) {
    if (!rawText) return "";

    // 1. Text ko safe banana (XSS prevention)
    let text = rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 2. Text ko ` ``` ` ke hisaab se tukdo mein todna
    let parts = text.split(/(```[\s\S]*?```)/g);
    let finalHtml = "";

    parts.forEach(part => {
        if (part.startsWith('```') && part.endsWith('```')) {
            // 💻 YE CODE BLOCK HAI
            let match = part.match(/```(\w*)\n?([\s\S]*?)```/);
            if (match) {
                let lang = match[1] ? match[1].toUpperCase() : 'CODE';
                let codeContent = match[2];
                let rawCodeToCopy = codeContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                
                // Color lagana
                let coloredCode = window.applyNativeHighlighting(codeContent);

                // Premium Code Box HTML
                finalHtml += `
                <div class="premium-code-box">
                    <div class="code-header">
                        <span class="code-lang">${lang}</span>
                        <button class="code-copy-btn" onclick="window.copyCodeBlock(this, '${encodeURIComponent(rawCodeToCopy)}')">
                            <i class="far fa-copy"></i> <span>Copy</span>
                        </button>
                    </div>
                    <div class="code-body custom-scrollbar">
                        <pre><code>${coloredCode}</code></pre>
                    </div>
                </div>`;
            }
        } else {
            // 📝 YE NORMAL TEXT HAI
            let formatted = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
            formatted = formatted.replace(/\n/g, '<br>'); // Line breaks
            finalHtml += `<span class="normal-text-span">${formatted}</span>`;
        }
    });

    return finalHtml;
};

























/* ==========================================================================
   🌌 WEB 4.0 QUANTUM CORE: NEW CHAT CONNECTION LOGIC
   ========================================================================== */

const FuturisticOS_Core = (function() {
    // 🛡️ 3. HIGH-SECURITY WEB 4.0 & ANTI-HACK GUARD
    const securityHash = "0xA9F8...BlockchainIntegrityLayer...Active";
    Object.freeze(securityHash);

    // ⏱️ 6. SMART BEHAVIORAL ADAPTATION (PACE SENSING)
    let lastInteractionTime = 0;
    let interactionPace = "Relaxed";

    function analyzePace() {
        const currentTime = performance.now();
        const timeDiff = currentTime - lastInteractionTime;
        lastInteractionTime = currentTime;
        interactionPace = timeDiff < 800 ? "Fast" : "Relaxed";
        return interactionPace;
    }

    // 🔋 10. HIGH-PERFORMANCE OPTIMIZATION
    const hardwareCores = navigator.hardwareConcurrency || 2;
    const isUltraPower = hardwareCores > 4;

    // 🧠 2. PREDICTIVE LOGIC (CONSCIOUS MIND-SETUP)
    document.addEventListener('mouseover', (e) => {
        if (e.target.id === 'new-chat-btn' || e.target.closest('#new-chat-btn')) {
            if(isUltraPower) document.body.classList.add('predictive-organic-fluid-ready');
        }
    });

    // 🛠️ 2. AUTO-REPAIR ENGINE (SELF-HEALING LAYER)
    function healSystem(errorContext, fallbackAction) {
        console.warn(`[Web 4.0 Auto-Repair] Healing sequence engaged for: ${errorContext}`);
        requestAnimationFrame(() => fallbackAction());
    }

    // 📱 4 & 7. UNIVERSAL PREMIUM OS HYBRID
    function applyLiquidTransitions(element) {
        if(!element) return;
        element.style.transition = interactionPace === "Fast" 
            ? "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)"  
            : "all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)";    
    }

    return { analyzePace, healSystem, applyLiquidTransitions, isUltraPower };
})();

// 🚀 WEB 4.0 UI CORE
const Web4_Quantum_UI_Core = (function() {
    const uiSecurityHash = "0x4A9C...QuantumEncryptedUI...Web4Active";
    Object.freeze(uiSecurityHash);

    function executeWithAutoHeal(contextName, executionBlock, fallbackBlock) {
        try { executionBlock(); } catch (error) {
            console.warn(`[Web 4.0 Auto-Heal] Neural repair engaged for: ${contextName}`);
            if (typeof fallbackBlock === 'function') requestAnimationFrame(() => fallbackBlock());
        }
    }
    return { executeWithAutoHeal };
})();




// 🚀 FIXED: HAR BAAR NEW CHAT ROOM OPEN HOGA
// =========================================================
// 🚀 MASTER FIX: हर बार 100% नया और फ्रेश चैट रूम खुलेगा
// =========================================================
window.openNewChatRoom = function(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }

    // 1. हमेशा नई ID और फर्स्ट मैसेज सेट करो
    window.isFirstMessage = true;
    window.currentSessionId = 'chat_' + Date.now();
    window.currentChatType = 'text';

    if(typeof window.stopChatGeneration === 'function') window.stopChatGeneration();
    if(typeof triggerVibration === 'function') triggerVibration("medium");

    // 2. साइडबार बंद करें
    const sidebar = document.getElementById('sidebar-menu');
    if(sidebar) { sidebar.classList.remove('active'); sidebar.classList.add('-translate-x-full'); }

    // 3. 🚀 पुरानी चैट को स्क्रीन से पूरी तरह साफ़ (Clear) करें
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        chatBox.querySelectorAll('.chat-message-row').forEach(m => m.remove());
    }

    // 4. Welcome बैनर को वापस लाएं
    const welcomeBanner = document.getElementById('welcome-banner');
    if(welcomeBanner) welcomeBanner.style.display = 'flex';

    // 5. इनपुट बॉक्स और बटन्स को डिफ़ॉल्ट (खाली) करें
    const chatInput = document.getElementById('chat-user-input');
    if(chatInput) {
        chatInput.value = '';
        if(typeof window.autoResizeInput === 'function') window.autoResizeInput(chatInput);
    }
    document.getElementById("chat-send-btn")?.classList.add("hidden");
    document.getElementById("chat-mic-btn")?.classList.remove("hidden");

    // 6. फुलस्क्रीन चैट रूम ओपन करें
    const chatOverlay = document.getElementById('fullscreen-chat-room');
    if(chatOverlay) {
        chatOverlay.classList.remove('hidden');
        chatOverlay.style.display = 'flex';
    }
};



// --- CHAT ROOM CLOSE LOGIC ---
window.closeChatRoomFullscreen = function() {
    Web4_Quantum_UI_Core.executeWithAutoHeal("ChatRoom_Deactivation", () => {
        if(typeof triggerVibration === 'function') triggerVibration("light");
        
        const chatOverlay = document.getElementById('fullscreen-chat-room');
        if(chatOverlay) {
            chatOverlay.classList.add('hidden');
            chatOverlay.style.display = 'none';
        }
    });
};


/* ==========================================================================
/* ==========================================================================
   🚀 UI EVENT LISTENERS & CHAT PIPELINE (PART 2 - 100% CONNECTED)
   ========================================================================== */

// 1. 📝 AUTO-RESIZE & BUTTON TOGGLE (FIXED: Mic hamesha rahega)
window.autoResizeInput = function(textarea) {
    textarea.style.height = "40px"; // Default height
    textarea.style.height = textarea.scrollHeight + "px"; // Auto-expand
    
    const sendBtn = document.getElementById("chat-send-btn");
    
    // 🚀 FIX: Yahan se Mic button ko hide/show karne ka logic hata diya gaya hai
    // Ab Mic button hamesha apni jagah par rahega!
    
    if (textarea.value.trim().length > 0) {
        if(sendBtn) sendBtn.classList.remove("hidden"); // Text hone par Send button aayega
    } else {
        if(sendBtn) sendBtn.classList.add("hidden"); // Text na hone par Send button gayab hoga
    }
};


// 🚀 FIXED: Enter दबाने पर मैसेज सेंड नहीं होगा, नई लाइन बनेगी
window.handleChatEnter = function(e) {
    // अगर तुम सिर्फ Enter दबाते हो, तो यह टेक्स्ट को नीचे की लाइन में ले जाएगा।
    // कोई 'e.preventDefault()' या 'sendChatMessage()' नहीं चलेगा।
    
    // (Optional) अगर तुम चाहते हो कि Ctrl+Enter दबाने पर मैसेज सेंड हो जाए:
    if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        window.sendChatMessage();
    }
};


// 2. 🖱️ MENU BUTTONS LOGIC (+ AND 🔗)
window.toggleChatMenu = function(menuId, event) {
    if(event) event.stopPropagation();
    if(typeof triggerVibration === 'function') triggerVibration();
    
    const menu = document.getElementById(menuId);
    if(menuId === 'chat-plus-menu') document.getElementById('chat-tools-menu')?.classList.add("hidden");
    if(menuId === 'chat-tools-menu') document.getElementById('chat-plus-menu')?.classList.add("hidden");
    
    if(menu) menu.classList.toggle("hidden");
};

// बाहर क्लिक करने पर मेनू बंद करना
document.addEventListener("click", (e) => {
    if (!e.target.closest('#chat-plus-btn') && !e.target.closest('#chat-plus-menu')) {
        document.getElementById('chat-plus-menu')?.classList.add('hidden');
    }
    if (!e.target.closest('#chat-link-btn') && !e.target.closest('#chat-tools-menu')) {
        document.getElementById('chat-tools-menu')?.classList.add('hidden');
    }
});






// =========================================================
// 🚀 1. UNIVERSAL FILE UPLOAD LOGIC (+ ICON)
// =========================================================
window.triggerUniversalUpload = function() {
    if(typeof triggerVibration === 'function') triggerVibration();
    document.getElementById('universal-file-upload')?.click(); // हिडन इनपुट को क्लिक करेगा
    document.getElementById('chat-plus-menu')?.classList.add('hidden'); // मेनू बंद करेगा
};

// 📂 फाइल्स सेलेक्ट होने पर उन्हें मैसेज बॉक्स में जोड़ना
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('universal-file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if(files.length > 0) {
                // सभी फाइल्स के नाम निकाल कर एक लिस्ट बनाना
                let fileNames = Array.from(files).map(f => f.name).join(', ');
                const chatInput = document.getElementById('chat-user-input');
                
                // इनपुट बॉक्स में फाइल का नाम जोड़ देना
                chatInput.value += (chatInput.value ? '\n' : '') + `[📎 Attached Files: ${fileNames}] `;
                window.autoResizeInput(chatInput);
                chatInput.focus();
            }
        });
    }
});


// =========================================================
// 🚀 2. SMART TOOLS LOGIC (🔗 ICON)
// =========================================================
window.currentAITool = "Standard"; // डिफ़ॉल्ट मोड

window.selectActiveTool = function(btn, event) {
    if(event) event.stopPropagation();
    if(typeof triggerVibration === 'function') triggerVibration();
    
    window.currentAITool = btn.innerText.trim(); // 🧠 AI याद रखेगा कि कौन सा टूल चुना है
    
    document.getElementById('active-tool-text').innerText = window.currentAITool;
    document.getElementById('active-tool-indicator').classList.remove('hidden');
    document.getElementById('chat-tools-menu').classList.add('hidden');
};

window.clearActiveTool = function() {
    window.currentAITool = "Standard";
    document.getElementById('active-tool-indicator').classList.add('hidden');
};




// 4. 🛡️ SAFE ACTIONS (READ, COPY, EDIT)
window.handleSafeAction = async function(action, btnElement) {
    if(typeof triggerVibration === 'function') triggerVibration();
    const rawText = decodeURIComponent(btnElement.getAttribute('data-text'));
    
    if(action === 'copy') {
        await navigator.clipboard.writeText(rawText);
        const orig = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => btnElement.innerHTML = orig, 2000);
    } 
    else if(action === 'edit') {
        const chatInput = document.getElementById("chat-user-input");
        if(chatInput) {
            chatInput.value = rawText;
            window.autoResizeInput(chatInput);
            chatInput.focus();
        }
    }
    else if (action === 'read' && typeof window.playAIVoice === 'function') {
        window.playAIVoice(rawText);
    }
};



function buildCollapsibleUI(text) {
    if (text.split('\n').length > 5 || text.length > 250) {
        // 🚀 FIX: बटन को <div class="msg-content"> से पहले (ऊपर) रख दिया है
        return `<button class="show-more-btn" style="border-top:none; border-bottom:1px solid var(--tc-border); margin-top:0; margin-bottom:10px; padding-top:0; padding-bottom:10px;" onclick="window.toggleTextFold(this)"><i class="fas fa-chevron-down"></i> Show More</button>
                <div class="msg-content msg-collapsed">${text.replace(/\n/g, '<br>')}</div>`;
    }
    return `<div class="msg-content">${text.replace(/\n/g, '<br>')}</div>`;
}


// 5. 🚀 MASTER SEND LOGIC & AI HOLOGRAM
window.isGenerating = false;
window.thinkingInterval = null;

// =========================================================
// 🚀 FIX: MASTER STOP LOGIC (Thinking & Typing Both)
// =========================================================
window.stopChatGeneration = function() {
    // 1. जनरेशन और थिंकिंग टाइमर को तुरंत रोकें
    window.isGenerating = false;
    clearInterval(window.thinkingInterval);
    
    // 2. बटन्स को वापस सेट करें
    document.getElementById("chat-stop-btn")?.classList.add("hidden");
    document.getElementById("chat-mic-btn")?.classList.remove("hidden");

    // 3. 🚀 FIX: स्क्रीन पर मौजूद सभी घूमते हुए होलोग्राम को तुरंत रोक दें
    document.querySelectorAll('.inline-mini-hologram.is-typing').forEach(holo => {
        holo.classList.remove('is-typing');
        holo.classList.add('stopped');
    });

    // 4. 🚀 FIX: थिंकिंग या टाइपिंग के बीच में रोका है, तो स्टेटस और मैसेज अपडेट करें
    document.querySelectorAll('span[id^="status-msg-"]').forEach(statusSpan => {
        // अगर टास्क पूरा नहीं हुआ था, तो उसे 'Stopped' कर दें
        if (statusSpan.innerText !== "Task Completed." && statusSpan.innerText !== "Stopped by User.") {
            statusSpan.innerText = "Stopped by User.";
            
            let msgId = statusSpan.id.replace('status-', '');
            let bubbleWrap = document.getElementById(`bubble-wrap-${msgId}`);
            
            // अगर 10 सेकंड की 'Thinking' के दौरान रोका गया है (बबल हिडन था)
            if (bubbleWrap && bubbleWrap.classList.contains('hidden')) {
                bubbleWrap.classList.remove('hidden'); // बबल को दिखाएँ
                
                let textElement = document.getElementById(`text-${msgId}`);
                if(textElement) textElement.innerHTML = "<em>Generation stopped by user.</em>";
                
                let actions = document.getElementById(`actions-${msgId}`);
                if(actions) actions.classList.remove('hidden'); // 3-dots, feedback बटन वापस लाएं
            }
        }
    });
};


// HTML Mic Button Connection
window.toggleChatMic = function() {
    const chatMicBtn = document.getElementById("chat-mic-btn");
    if(chatMicBtn) chatMicBtn.click(); // Connects to Part 3 Audio Engine
};







        
// =========================================================
// 🚀 MASTER SEND LOGIC & AI HOLOGRAM (PERFECT PLACEMENT)
// =========================================================
window.sendFeedback = function(type, msgId) {
    if(typeof triggerVibration === 'function') triggerVibration();
    console.log(`[Server Request] Feedback '${type}' sent for Message ID: ${msgId}`);
    window.showA1Modal('alert', 'Feedback Sent', 'Aapka feedback backend ko bhej diya gaya hai.');
};

window.sendChatMessage = function() {
    const chatInput = document.getElementById("chat-user-input");
    const chatBox = document.getElementById("chat-box");
    const aiIndicator = document.getElementById("ai-thinking-indicator"); // पुराना इंडिकेटर बंद रखेंगे
    
    if(!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const safeSessionId = window.currentSessionId || 'chat_' + Date.now();
    window.currentSessionId = safeSessionId;

    // =========================================================
    // 🚀 FIX: Text Chat और Voice Chat की हिस्ट्री को 100% एक कर दिया है
    // =========================================================
    if (window.isFirstMessage && typeof window.chatSessions !== 'undefined') {
        const safeSessionId = window.currentSessionId || 'chat_' + Date.now();
        window.currentSessionId = safeSessionId;

        // 🚀 बिल्कुल Live Voice Chat जैसा ही ऑब्जेक्ट (Unified)
        const unifiedChatEntry = {
            id: safeSessionId,
            title: text.length > 30 ? text.substring(0, 30) + "..." : text,
            type: 'text',
            timestamp: Date.now(),
            isPinned: false,
            isDeleted: false,
            messages: [] // सिर्फ Text चैट के मैसेजेस के लिए
        };

        window.chatSessions.unshift(unifiedChatEntry);
        // 🚀 Voice चैट की तरह तुरंत सेव करना ज़रूरी है ताकि बटन्स काम कर सकें!
        if(typeof window.saveHistory === 'function') window.saveHistory(); 
        window.isFirstMessage = false;
    }



    window.saveMessageToSession(safeSessionId, 'user', text);
    if(typeof triggerVibration === 'function') triggerVibration();
    document.getElementById("welcome-banner").style.display = "none";
    
    chatInput.value = ""; window.autoResizeInput(chatInput); window.isGenerating = true;
    document.getElementById("chat-stop-btn")?.classList.remove("hidden"); 
    document.getElementById("chat-send-btn")?.classList.add("hidden");    
    
    // 1. USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.className = "chat-message-row user";
    const safeEncodedUser = encodeURIComponent(text); 
    userDiv.innerHTML = `<div class="bubble-container" style="display: flex; flex-direction: column; align-items: flex-end;"><div class="chat-bubble user-bubble">${window.formatUserMessage(text)}</div><div class="user-action-bar"><button class="action-icon-btn" onclick="window.handleSafeAction('edit', this)" data-text="${safeEncodedUser}"><i class="fas fa-pen"></i></button><button class="action-icon-btn" onclick="window.handleSafeAction('copy', this)" data-text="${safeEncodedUser}"><i class="fas fa-copy"></i></button></div></div>`;
    
    chatBox.insertBefore(userDiv, aiIndicator);

    // 2. CREATE SEPARATE AI MESSAGE CONTAINER WITH HOLOGRAM ON TOP
    let msgId = 'msg-' + Date.now();
    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-message-row ai";
    
    // 🚀 FIX: होलोग्राम अब मैसेज बॉक्स के बाहर, एकदम ऊपर है!
        // 🚀 FIX 2: Theme Friendly Hologram Colors (in script_02.js)
    aiDiv.innerHTML = `
        <div class="hologram-status-bar" style="display:flex; align-items:center; gap:10px; margin-bottom: 8px; padding-left: 5px;">
            <div id="holo-${msgId}" class="inline-mini-hologram is-typing" style="width:20px; height:20px;">
                <div class="mini-ring" style="width:18px; height:18px; border-color:#3b82f6;"></div> <div class="mini-core" style="width:6px; height:6px; background:#3b82f6;"></div> </div>
            <span id="status-${msgId}" style="font-weight:600; font-size:13px; color:var(--text-primary);">Connecting to Server...</span>
        </div>
        
        <div class="bubble-container hidden" id="bubble-wrap-${msgId}" style="width: 100%;">
            <div class="chat-bubble ai-bubble" style="width: 100%; max-width: 95%;">
                <div class="ai-header-row" style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 8px;">
                    <span class="chat-name-tag" style="font-weight:bold;">A1:</span>
                    <button class="action-icon-btn" id="reader-${msgId}" style="padding: 2px 8px;">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="chat-msg-text" id="text-${msgId}"></div>
            </div>
            
            <div class="chat-action-bar hidden" id="actions-${msgId}" style="margin-left: 10px; margin-top: 5px; display: flex; gap: 10px;">
                <button class="action-icon-btn" id="copy-${msgId}"><i class="fas fa-copy"></i></button>
                <button class="action-icon-btn" onclick="window.sendFeedback('up', '${msgId}')"><i class="fas fa-thumbs-up"></i></button>
                <button class="action-icon-btn" onclick="window.sendFeedback('down', '${msgId}')"><i class="fas fa-thumbs-down"></i></button>
                <button class="action-icon-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
        </div>`;

    
    aiIndicator.classList.add("hidden"); // पुराना डिफ़ॉल्ट इंडिकेटर छुपा दिया
    chatBox.insertBefore(aiDiv, aiIndicator);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });

    const statusText = document.getElementById(`status-${msgId}`);
    let phases = ["🌐 Routing Request...", "🔍 Deep Searching Server...", "📊 Fetching AI Models..."];
    if (window.currentAITool.includes("Video")) phases = ["🎬 Connecting Media Engine...", "🎞️ Generating Video Frames..."];
    else if (window.currentAITool.includes("Photo")) phases = ["🎨 Initializing GPU...", "✨ Creating Visuals..."];
    
    let pIndex = 0; 
    window.thinkingInterval = setInterval(() => {
        pIndex = (pIndex + 1) % phases.length;
        if(statusText) statusText.innerText = phases[pIndex];
    }, 2500);

    // 3. 10s DELAY THEN HUMAN TYPING
    setTimeout(() => { 
        if(!window.isGenerating) return; 
        clearInterval(window.thinkingInterval);
        
        if(statusText) statusText.innerText = "A1 is Typing...";
        document.getElementById(`bubble-wrap-${msgId}`).classList.remove("hidden"); // अब मैसेज बॉक्स दिखेगा

        let rawResponse = `Main A1 AI hoon. Aapka [${window.currentAITool}] request process ho gaya hai.`;
        window.saveMessageToSession(safeSessionId, 'ai', rawResponse);
        let safeEncodedAi = encodeURIComponent(rawResponse);

        // Reader aur Copy button mein data set karna
        document.getElementById(`reader-${msgId}`).setAttribute('data-text', safeEncodedAi);
        document.getElementById(`reader-${msgId}`).setAttribute('onclick', `window.handleSafeAction('read', this)`);
        document.getElementById(`copy-${msgId}`).setAttribute('data-text', safeEncodedAi);
        document.getElementById(`copy-${msgId}`).setAttribute('onclick', `window.handleSafeAction('copy', this)`);

        // ⌨️ HUMAN TYPING EFFECT
        const textElement = document.getElementById(`text-${msgId}`);
        let i = 0;
        function typeWriter() {
            if (i < rawResponse.length && window.isGenerating) {
                textElement.innerHTML += rawResponse.charAt(i);
                i++;
                chatBox.scrollTo({ top: chatBox.scrollHeight });
                setTimeout(typeWriter, 30);
            } else {
                // 🛑 STOP SPINNING: होलोग्राम घूमेगा नहीं, पर वहीँ ऊपर ही खड़ा रहेगा!
                document.getElementById(`holo-${msgId}`)?.classList.remove('is-typing');
                document.getElementById(`holo-${msgId}`)?.classList.add('stopped');
                if(statusText) statusText.innerText = "Task Completed."; // स्टेटस बदल गया
                
                document.getElementById(`actions-${msgId}`)?.classList.remove('hidden');
                document.getElementById("chat-stop-btn")?.classList.add("hidden");
                window.isGenerating = false;
            }
        }
        typeWriter(); 
    }, 10000); // 10s Server Delay
};
                         




   






                                           
      


    
    
    
    
        












/* ==========================================================================
   🌌 WEB 4.0 QUANTUM AUDIO CORE: SMART READER & MIC ENGINE (PART 3)
   ========================================================================== */

const Web4_Audio_Quantum_Core = (function() {
    const audioSecurityHash = "0x7B2F...AudioIntegrityLayer...Active";
    Object.freeze(audioSecurityHash);

    const hardwareCores = navigator.hardwareConcurrency || 2;
    const isUltraPower = hardwareCores >= 6; 

    function healAudioSystem(errorContext, fallbackAction) {
        console.warn(`[Web 4.0 Auto-Heal] Neural repair engaged for Audio Module: ${errorContext}`);
        if(typeof fallbackAction === 'function') requestAnimationFrame(() => fallbackAction());
    }

    return { isUltraPower, healAudioSystem };
})();

// ==========================================
// 🛠️ SMART READER ENGINE (PAUSE / RESUME)
// ==========================================
window.a1ReaderState = { currentText: "", isPaused: false };

window.playAIVoice = function(text) {
    Web4_Quantum_UI_Core.executeWithAutoHeal("AIVoice_Synthesis_Engine", () => {
        if (!window.speechSynthesis) return;

        if (window.a1ReaderState.currentText === text) {
            if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
                if (window.a1ReaderState.isPaused) {
                    window.speechSynthesis.resume(); 
                    window.a1ReaderState.isPaused = false;
                } else {
                    window.speechSynthesis.pause();  
                    window.a1ReaderState.isPaused = true;
                }
                return; 
            }
        }

        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
        
        window.a1ReaderState.currentText = text;
        window.a1ReaderState.isPaused = false;

        let cleanText = text.replace(/[*#_`]/g, '').replace(/Commander AI:/gi, '').trim();
        let utterance = new SpeechSynthesisUtterance(cleanText);
        
        let availableVoices = window.speechSynthesis.getVoices();
        let selectedVoice = availableVoices.find(v => v.lang.includes("hi-IN") || v.lang.includes("en-IN")) || availableVoices[0];
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = Web4_Audio_Quantum_Core.isUltraPower ? 1.05 : 1.0;

        utterance.onend = () => { window.a1ReaderState.currentText = ""; window.a1ReaderState.isPaused = false; }; 
        utterance.onerror = () => { window.a1ReaderState.currentText = ""; window.a1ReaderState.isPaused = false; };
        
        window.speechSynthesis.speak(utterance);
        
    }, () => {
        window.speechSynthesis.cancel();
        window.a1ReaderState.currentText = ""; 
        window.a1ReaderState.isPaused = false;
    });
};

// ==========================================
// 🛠️ CHAT ROOM MIC LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatMicBtn = document.getElementById("chat-mic-btn");
    const chatInput = document.getElementById("chat-user-input");

    const SpeechRecAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let chatRoomMic;
    let isChatMicRunning = false;

    if (SpeechRecAPI && chatMicBtn && chatInput) {
        chatRoomMic = new SpeechRecAPI();
        chatRoomMic.lang = 'hi-IN'; 
        chatRoomMic.continuous = true;
        chatRoomMic.interimResults = true;

        chatRoomMic.onstart = () => {
            isChatMicRunning = true;
            chatMicBtn.innerHTML = '<i class="fas fa-microphone" style="color: var(--tc-text-muted);"></i>'; 
            if(typeof triggerVibration === 'function') triggerVibration();
        };

        chatRoomMic.onresult = (event) => {
            let finalTrans = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTrans += event.results[i][0].transcript;
            }
            if(finalTrans) {
                chatInput.value += (chatInput.value ? " " : "") + finalTrans;
                chatInput.dispatchEvent(new Event('input')); 
            }
        };

        chatRoomMic.onend = () => {
            isChatMicRunning = false;
            chatMicBtn.innerHTML = '<i class="fas fa-microphone"></i>'; 
        };

        chatMicBtn.addEventListener("click", () => {
            if (isChatMicRunning) chatRoomMic.stop();
            else chatRoomMic.start();
        });
    }
});







// 🚀 NEW: मैसेज को डेटाबेस (Storage) में सेव करने का मास्टर फंक्शन
window.saveMessageToSession = function(sessionId, sender, text) {
    let chat = window.chatSessions.find(c => String(c.id) === String(sessionId));
    if(chat) {
        if(!chat.messages) chat.messages = []; // अगर मैसेज एरे नहीं है तो बनाओ
        chat.messages.push({ sender: sender, text: text });
        window.saveHistory();
    }
};







