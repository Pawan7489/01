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
        inputHtml = `<input type="text" id="a1-modal-input-field" value="${defaultValue}" style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 10px; border: 1px solid var(--os-border); background: var(--os-bg-main); color: var(--os-text-primary); font-family: inherit; font-size: 14px; outline: none; box-sizing: border-box;">`;
    }

    let buttonsHtml = '';
    if (type === 'alert') {
        buttonsHtml = `<button id="a1-modal-btn-ok" style="width: 100%; background: var(--os-text-primary, #fff); color: var(--os-bg-main, #000); border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;">OK</button>`;
    } else {
        buttonsHtml = `
            <button id="a1-modal-btn-cancel" style="flex: 1; background: transparent; color: var(--os-text-primary, #fff); border: 1px solid var(--os-border, rgba(255,255,255,0.2)); padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s;">Cancel</button>
            <button id="a1-modal-btn-ok" style="flex: 1; background: var(--os-text-primary, #fff); color: var(--os-bg-main, #000); border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;">OK</button>
        `;
    }

    const modalHtml = `
        <div id="a1-custom-ui-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); z-index: 999999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 20px;">
            <div style="background: var(--os-dropdown-bg, #111827); border: 1px solid var(--os-border, rgba(255,255,255,0.1)); padding: 24px; border-radius: 20px; width: 100%; max-width: 320px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center; font-family: 'Inter', sans-serif;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; color: var(--os-text-primary, #fff);">${title}</h3>
                <p style="color: var(--os-text-secondary, #aaa); font-size: 14px; margin-bottom: 20px;">${message}</p>
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
            const isActive = chat.id === window.currentSessionId ? 'var(--os-btn-bg, rgba(128,128,128,0.15))' : 'var(--os-btn-bg, rgba(128,128,128,0.05))';
            const pinColor = chat.isPinned ? '#facc15' : 'var(--os-text-secondary, #d1d5db)';
            const titleColor = chat.isPinned ? '#facc15' : 'var(--os-text-primary, #ffffff)';
            const safeTitle = escapeSafeHTML(chat.title);
            const pinIconHtml = chat.isPinned ? `<i class="fas fa-thumbtack" style="color: #facc15; margin-right: 8px; font-size: 13px; transform: rotate(45deg);"></i>` : '';

            html += `
                <div class="history-item-wrapper clean-wrapper" style="display:flex; flex-direction: column; align-items: flex-start; position: relative; margin-bottom: 8px; background: ${isActive}; border: 1px solid var(--os-border, rgba(128,128,128,0.2)); border-radius: 12px; transition: 0.3s;" id="wrapper-${chat.id}">
                    
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
                    
                    <div id="menu-${chat.id}" class="history-context-menu hidden" style="width: 100%; box-sizing: border-box; background: var(--os-dropdown-bg, #111827); padding: 8px; border-radius: 0 0 12px 12px; border-top: 1px solid var(--os-border, rgba(255,255,255,0.1)); pointer-events: auto;">
                        
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
                                <span style="font-weight:600; font-size:13px; color:var(--os-text-secondary);">Task Completed.</span>
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
            container.innerHTML = '<p style="text-align:center; color:var(--os-text-secondary); margin-top: 20px;">No deleted chats.</p>';
            return;
        }

        deletedChats.forEach(chat => {
            const safeTitle = escapeSafeHTML(chat.title);
            html += `
                <div class="trash-item" style="background: var(--os-btn-bg, rgba(128,128,128,0.1)); padding: 14px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--os-border, rgba(128,128,128,0.2));">
                    <div class="trash-item-header" style="display: flex; gap: 10px; color: var(--os-text-primary); margin-bottom: 12px; align-items: center;">
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


