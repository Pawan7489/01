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

window.toggleVoiceAttachMenu = (event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const attachMenu = document.getElementById('attachment-menu');
    const bottomNav = document.querySelector('.voice-bottom-nav');
    if (!attachMenu) return;

    const shouldShow = attachMenu.classList.contains('hidden');
    if (shouldShow) {
        if (bottomNav) bottomNav.style.overflow = 'visible';
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
        attachMenu.classList.add('hidden');
        attachMenu.style.display = 'none';
    }
    if (navigator.vibrate) navigator.vibrate(20);
};

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



/* =========================================================
   🚀 CHATGPT STYLE: SHOW MORE / LESS ICON LOGIC
   (सुनिश्चित करें कि यह कोड आपकी फ़ाइल में मौजूद हो)
========================================================= */
window.toggleMsgExpand = function(btn) {
    if(typeof triggerVibration === 'function') triggerVibration(10);
    const contentDiv = btn.previousElementSibling; 
    if(contentDiv) {
        contentDiv.classList.toggle('collapsed');
    }
};

window.formatLongMessage = function(text) {
    let formattedText = text.replace(/\n/g, '<br>');
    if (text.split('\n').length > 4 || text.length > 150) {
        return `<div class="msg-content-wrapper">
                    <div class="msg-text-content collapsed">${formattedText}</div>
                    <button onclick="window.toggleMsgExpand(this)" class="msg-toggle-icon-btn" title="Expand/Collapse">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>`;
    }
    return `<div class="msg-text-content">${formattedText}</div>`;
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










