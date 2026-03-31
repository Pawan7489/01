
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
            <div style="background: var(--os-dropdown-bg); border: 1px solid var(--os-border); padding: 30px; border-radius: 20px; text-align: center; width: 100%; max-width: 400px; box-shadow: var(--os-shadow); transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <h3 style="margin-top: 0; font-size: 22px; color: var(--os-text-primary);">${title}</h3>
                <p style="color: var(--os-text-secondary); margin-bottom: 25px; line-height: 1.5;">${message}</p>
                <button onclick="window.closeCustomModal()" style="background: var(--os-text-primary); color: var(--os-bg-main); border: none; padding: 12px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; width: 100%; transition: opacity 0.2s;">Close / बंद करें</button>
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
    if (modal) modal.classList.add('hidden');
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
// 🚀 LOGOUT FUNCTIONALITY (लॉगआउट फिक्स)
// ==========================================
window.logoutUser = function(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    
    if(typeof triggerVibration === 'function') triggerVibration("medium");
    
    document.getElementById('profile-dropdown')?.classList.add('hidden');
    const sidebar = document.getElementById('sidebar-menu');
    if(sidebar) { 
        sidebar.classList.remove('active'); 
        sidebar.classList.add('-translate-x-full'); 
    }
    
    // 🚀 CRITICAL FIX: Home Screen ko chhupao
    const homeScreen = document.getElementById('app-home-screen-wrapper');
    if(homeScreen) {
        homeScreen.style.setProperty('display', 'none', 'important');
    }

    // 🚀 CRITICAL FIX: Floating Buttons ko bhi chhupao
    const floatingBtns = document.querySelector('.floating-action-group');
    if (floatingBtns) {
        floatingBtns.style.setProperty('display', 'none', 'important');
    }
    
    document.getElementById('fullscreen-chat-room')?.classList.add('hidden');
    document.getElementById('live-voice-overlay')?.classList.add('hidden');
    
    localStorage.removeItem('a1_ai_logged_in'); 
    localStorage.removeItem('a1_is_logged_in'); 
    
    // Auth (Login) page wapas lao
    const authContainer = document.getElementById('auth-container');
    if(authContainer) {
        authContainer.classList.remove('hidden');
        authContainer.style.setProperty('display', 'block', 'important');
        
        if(typeof switchView === 'function') {
            switchView('login-view');
        }
    }
    
    if(typeof window.showA1Modal === 'function') {
        window.showA1Modal('alert', 'Logged Out', 'Aap successfully logout ho gaye hain. Phir milenge!');
    }
};










/* =========================================================
   🚀 ULTIMATE MASTER FIX: HISTORY CLICK ROUTING (Simulated Click)
   (यह सीधे मेन बटन्स को क्लिक करवाएगा, जो 100% काम करते हैं)
========================================================= */

document.addEventListener('click', function(e) {
    const historyItem = e.target.closest('#history-list-container > div, .history-item, [data-type]');
    const isInsideHistory = e.target.closest('#history-list-container');

    if (historyItem && isInsideHistory) {
        e.preventDefault(); 
        
        // 1. पता लगाएं कि कौन सी हिस्ट्री है (Voice या Text)
        const isVoiceChat = historyItem.getAttribute('data-type') === 'voice' || 
                            historyItem.innerHTML.includes('fa-microphone') || 
                            historyItem.classList.contains('voice-history');

        // 2. 🚀 MASTER FIX: सीधे असली मेन बटन्स को क्लिक करवाएं!
        if (isVoiceChat) {
            console.log("🎤 Triggering Main Live Voice Button...");
            const mainVoiceBtn = document.getElementById('live-voice-chatroom') || document.querySelector('.live-chat-btn');
            if (mainVoiceBtn) {
                mainVoiceBtn.click(); // यह होम स्क्रीन वाले बटन को दबा देगा
            }
        } else {
            console.log("💬 Triggering Main Text Chat Button...");
            const mainTextBtn = document.getElementById('New-Chatroom') || document.querySelector('.new-chat-btn');
            if (mainTextBtn) {
                mainTextBtn.click(); // यह होम स्क्रीन वाले 'New Chat' बटन को दबा देगा
            }
        }

        // 3. साइडबार को बंद कर दें
        const sidebar = document.getElementById('sidebar-menu');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
});

window.closeWebsitePreview = () => {
    const modal = document.getElementById('website-preview-modal');
    const previewFrame = document.getElementById('live-preview-iframe');
    if (previewFrame) previewFrame.removeAttribute('src');
    if (modal) modal.classList.add('hidden');
};
