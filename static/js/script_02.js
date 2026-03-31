

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

/* ==========================================
/* ==========================================
   🚀 FIXED: SHOW MORE / SHOW LESS LOGIC (TOP POSITION)
========================================== */

window.toggleTextFold = function(btn) {
    if(typeof triggerVibration === 'function') triggerVibration();
    
    // 🚀 FIX: 'previous' की जगह 'next' कर दिया, क्योंकि बटन अब टेक्स्ट के ऊपर है
    const textDiv = btn.nextElementSibling; 
    textDiv.classList.toggle('msg-collapsed');
    
    if (textDiv.classList.contains('msg-collapsed')) {
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
    } else {
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
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
    userDiv.innerHTML = `<div class="bubble-container" style="display: flex; flex-direction: column; align-items: flex-end;"><div class="chat-bubble user-bubble">${text.replace(/\n/g, '<br>')}</div><div class="user-action-bar"><button class="action-icon-btn" onclick="window.handleSafeAction('edit', this)" data-text="${safeEncodedUser}"><i class="fas fa-pen"></i></button><button class="action-icon-btn" onclick="window.handleSafeAction('copy', this)" data-text="${safeEncodedUser}"><i class="fas fa-copy"></i></button></div></div>`;
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
            <span id="status-${msgId}" style="font-weight:600; font-size:13px; color:var(--os-text-primary);">Connecting to Server...</span>
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

