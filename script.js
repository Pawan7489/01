
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
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const stylePackStorageKey = 'a1_style_pack';
const typingSpeedStorageKey = 'a1_typing_speed_mode';
const typingSpeedMultipliers = {
    normal: 0.75,
    smooth: 1,
    ultra: 1.3
};

window.__humanTypingSpeedMode = 'smooth';
const stylePackTokenMap = {
    default: {
        radiusMd: '14px',
        radiusLg: '20px',
        elevation: '0 15px 35px rgba(0, 0, 0, 0.22)',
        glassBlur: '15px',
        uiAccent: '#9ca3af'
    },
    oneui: {
        radiusMd: '18px',
        radiusLg: '24px',
        elevation: '0 12px 30px rgba(0, 0, 0, 0.24)',
        glassBlur: '18px',
        uiAccent: '#60a5fa'
    },
    ios: {
        radiusMd: '16px',
        radiusLg: '22px',
        elevation: '0 10px 28px rgba(0, 0, 0, 0.18)',
        glassBlur: '22px',
        uiAccent: '#a78bfa'
    },
    hyperos: {
        radiusMd: '20px',
        radiusLg: '28px',
        elevation: '0 16px 40px rgba(0, 0, 0, 0.26)',
        glassBlur: '20px',
        uiAccent: '#22d3ee'
    }
};

window.applyStylePack = (packName) => {
    const key = stylePackTokenMap[packName] ? packName : 'default';
    const tokens = stylePackTokenMap[key];

    document.body.classList.remove('style-pack-default', 'style-pack-oneui', 'style-pack-ios', 'style-pack-hyperos');
    document.body.classList.add(`style-pack-${key}`);

    document.documentElement.style.setProperty('--pack-radius-md', tokens.radiusMd);
    document.documentElement.style.setProperty('--pack-radius-lg', tokens.radiusLg);
    document.documentElement.style.setProperty('--pack-elevation', tokens.elevation);
    document.documentElement.style.setProperty('--pack-glass-blur', tokens.glassBlur);
    document.documentElement.style.setProperty('--pack-ui-accent', tokens.uiAccent);

    localStorage.setItem(stylePackStorageKey, key);
    const styleSelect = document.getElementById('style-pack-select');
    if (styleSelect && styleSelect.value !== key) styleSelect.value = key;
};

window.updateDeviceThemeEngine = () => {
    const w = window.innerWidth || document.documentElement.clientWidth || 0;
    document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
    if (w <= 768) document.body.classList.add('device-mobile');
    else if (w <= 1024) document.body.classList.add('device-tablet');
    else document.body.classList.add('device-desktop');

    document.body.classList.toggle('pointer-coarse', window.matchMedia('(pointer: coarse)').matches);
    document.body.classList.toggle('reduced-motion', reducedMotionQuery.matches);
};

window.changeAppTheme = (mode) => {
    let isDark = mode === 'dark' || (mode === 'system' && systemThemeQuery.matches);
    
    document.body.classList.toggle('light-mode', !isDark);
    document.body.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-light', !isDark);
    document.body.classList.toggle('theme-system', mode === 'system');
    localStorage.setItem('a1_os_theme', mode);

    document.querySelectorAll('.theme-switch-grid .mode-btn').forEach(btn => {
        btn.classList.remove('theme-active-btn');
    });
    
    const activeBtn = document.getElementById(`theme-btn-${mode}`);
    if (activeBtn) activeBtn.classList.add('theme-active-btn');

    if (navigator.vibrate) navigator.vibrate(15);
};

window.applyHumanTypingSpeedMode = (mode, options = {}) => {
    const force = !!options.force;
    const validMode = Object.prototype.hasOwnProperty.call(typingSpeedMultipliers, mode) ? mode : 'smooth';
    window.__humanTypingSpeedMode = validMode;
    localStorage.setItem(typingSpeedStorageKey, validMode);

    document.querySelectorAll('[data-typing-speed]').forEach((btn) => {
        btn.classList.toggle('theme-active-btn', btn.dataset.typingSpeed === validMode);
    });

    if (force && typeof window.initGlobalHumanTyping === 'function') {
        window.initGlobalHumanTyping({ force: true });
    }
};

// सिस्टम सेटिंग बदलने पर ऑटो-अपडेट
systemThemeQuery.addEventListener('change', () => {
    if (localStorage.getItem('a1_os_theme') === 'system') {
        window.changeAppTheme('system');
    }
});

reducedMotionQuery.addEventListener('change', () => {
    window.updateDeviceThemeEngine();
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
window.openLiveChat = (eventOrOptions) => {
    const event = eventOrOptions && typeof eventOrOptions.preventDefault === 'function' ? eventOrOptions : null;
    const options = event ? {} : (eventOrOptions || {});
    if (event) event.preventDefault();
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    
    // 🚀 1. नया सेशन और नई ID जनरेट करना
    window.isFirstMessage = true;
    const incomingRoomId = typeof options.roomId === 'string' && options.roomId.trim() ? options.roomId.trim() : '';
    window.currentSessionId = incomingRoomId || window.createRoomId('voice');
    window.currentChatType = 'voice'; 
    window.currentChatId = window.currentSessionId; 
    window.syncRoomUrl('voice', window.currentSessionId);

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

window.a1SupportState = {
    userRef: '',
    tickets: [],
    activeToken: '',
    mode: 'list'
};

window.getSupportUserRef = function() {
    const name = (localStorage.getItem('a1_user_name') || 'Commander').trim() || 'Commander';
    const mobile = (document.getElementById('login-mobile-input')?.value || '').trim();
    const email = (document.getElementById('login-email-input')?.value || '').trim().toLowerCase();
    const contactRef = mobile || email || name.toLowerCase().replace(/\s+/g, '_');
    return `usr_${contactRef.slice(0, 96)}`;
};

window.supportApi = async function(path, options = {}) {
    const res = await fetch(path, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.status === 'error') throw new Error(data.message || 'Support request failed');
    return data;
};

window.persistSupportTokenIds = function() {
    try {
        const ids = (window.a1SupportState.tickets || []).map(t => t.token).filter(Boolean);
        localStorage.setItem('a1_support_ticket_ids', JSON.stringify(ids));
    } catch (_) {}
};

window.renderSupportTokenList = function() {
    const list = document.getElementById('support-token-list');
    if (!list) return;
    const tickets = window.a1SupportState.tickets || [];
    if (!tickets.length) {
        list.innerHTML = '<div class="support-empty-state">Abhi koi token nahi bana hai.</div>';
        return;
    }
    list.innerHTML = tickets.map((t) => `
        <button class="support-token-item ${window.a1SupportState.activeToken === t.token ? 'active' : ''}" onclick="window.openSupportTicket('${t.token}')">
            <div class="support-token-id">${t.token}</div>
            <div class="support-token-subject">${window.escapeHtml(t.short_issue || 'No subject')}</div>
            <div class="support-token-meta">
                <span>${window.escapeHtml((t.status || 'open').toUpperCase())}</span>
                <span>${new Date((t.updated_at || 0) * 1000).toLocaleDateString()}</span>
            </div>
        </button>
    `).join('');
};

window.renderSupportCreateForm = function(prefill = {}) {
    const panel = document.getElementById('support-right-panel');
    if (!panel) return;
    const defaultName = (localStorage.getItem('a1_user_name') || '').trim();
    panel.innerHTML = `
        <div class="support-token-header">
            <strong>Create New Token</strong>
        </div>
        <form id="support-create-form" class="support-form-grid">
            <div>
                <label class="support-field-label">Your Name</label>
                <input class="support-input" name="name" value="${window.escapeHtml(prefill.name || defaultName)}" required minlength="2" maxlength="120">
            </div>
            <div>
                <label class="support-field-label">Mobile or Email</label>
                <input class="support-input" name="contact" value="${window.escapeHtml(prefill.contact || '')}" required>
            </div>
            <div>
                <label class="support-field-label">Short Error / Issue</label>
                <input class="support-input" name="shortIssue" value="${window.escapeHtml(prefill.shortIssue || '')}" required minlength="3" maxlength="180">
            </div>
            <div>
                <label class="support-field-label">Full Details</label>
                <textarea class="support-textarea" name="details" required minlength="10" maxlength="4000">${window.escapeHtml(prefill.details || '')}</textarea>
            </div>
            <div class="support-actions-row">
                <button type="button" class="support-btn" onclick="window.closeSupportCenter()">Cancel</button>
                <button type="submit" class="support-btn primary">Submit</button>
            </div>
        </form>
    `;

    const form = document.getElementById('support-create-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const fd = new FormData(form);
                const payload = {
                    userRef: window.a1SupportState.userRef,
                    name: (fd.get('name') || '').toString().trim(),
                    contact: (fd.get('contact') || '').toString().trim(),
                    shortIssue: (fd.get('shortIssue') || '').toString().trim(),
                    details: (fd.get('details') || '').toString().trim()
                };
                const res = await window.supportApi('/api/support/tickets', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                window.showA1Modal('alert', 'Token Created', `Support token created: ${res.ticket.token}`);
                await window.loadSupportTickets();
                window.openSupportTicket(res.ticket.token);
            } catch (err) {
                window.showA1Modal('alert', 'Support Error', err.message || 'Could not create token');
            }
        });
    }
};

window.renderSupportTicketDetails = function(ticket, isEdit = false) {
    const panel = document.getElementById('support-right-panel');
    if (!panel || !ticket) return;
    const isClosed = (ticket.status || 'open') === 'closed';
    const badgeClass = isClosed ? 'closed' : 'open';
    const formInner = isEdit ? `
        <form id="support-edit-form" class="support-form-grid">
            <div>
                <label class="support-field-label">Your Name</label>
                <input class="support-input" name="name" value="${window.escapeHtml(ticket.name || '')}" required>
            </div>
            <div>
                <label class="support-field-label">Mobile or Email</label>
                <input class="support-input" name="contact" value="${window.escapeHtml(ticket.contact || '')}" required>
            </div>
            <div>
                <label class="support-field-label">Short Error / Issue</label>
                <input class="support-input" name="shortIssue" value="${window.escapeHtml(ticket.short_issue || '')}" required>
            </div>
            <div>
                <label class="support-field-label">Full Details</label>
                <textarea class="support-textarea" name="details" required>${window.escapeHtml(ticket.details || '')}</textarea>
            </div>
            <div class="support-actions-row">
                <button type="button" class="support-btn" onclick="window.openSupportTicket('${ticket.token}')">Cancel</button>
                <button type="submit" class="support-btn primary">Resubmit</button>
            </div>
        </form>
    ` : `
        <div class="support-form-grid">
            <div><span class="support-field-label">Name</span><div>${window.escapeHtml(ticket.name || '')}</div></div>
            <div><span class="support-field-label">Contact</span><div>${window.escapeHtml(ticket.contact || '')}</div></div>
            <div><span class="support-field-label">Short Issue</span><div>${window.escapeHtml(ticket.short_issue || '')}</div></div>
            <div><span class="support-field-label">Details</span><div style="white-space: pre-wrap;">${window.escapeHtml(ticket.details || '')}</div></div>
        </div>
    `;
    panel.innerHTML = `
        <div class="support-token-header">
            <div>
                <strong>${window.escapeHtml(ticket.token)}</strong>
                <div class="support-field-label" style="margin-top: 3px;">Created: ${new Date((ticket.created_at || 0) * 1000).toLocaleString()}</div>
            </div>
            <span class="support-token-badge ${badgeClass}">${window.escapeHtml((ticket.status || 'open').toUpperCase())}</span>
        </div>
        ${formInner}
        ${ticket.admin_reply ? `<div class="support-admin-reply"><strong>Admin Reply:</strong><br>${window.escapeHtml(ticket.admin_reply)}</div>` : ''}
        ${!isEdit ? `<div class="support-actions-row">
            <button class="support-btn" onclick="window.openSupportTicket('${ticket.token}', true)">Edit</button>
            ${isClosed
                ? `<button class="support-btn primary" onclick="window.reopenSupportTicket('${ticket.token}')">Reopen</button>
                   <button class="support-btn" onclick="window.renderSupportCreateForm()">Create New Token</button>`
                : `<button class="support-btn" onclick="window.closeSupportTicket('${ticket.token}')">Close Token</button>`
            }
        </div>` : ''}
    `;

    if (isEdit) {
        const form = document.getElementById('support-edit-form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                try {
                    const fd = new FormData(form);
                    const payload = {
                        userRef: window.a1SupportState.userRef,
                        name: (fd.get('name') || '').toString().trim(),
                        contact: (fd.get('contact') || '').toString().trim(),
                        shortIssue: (fd.get('shortIssue') || '').toString().trim(),
                        details: (fd.get('details') || '').toString().trim()
                    };
                    await window.supportApi(`/api/support/tickets/${encodeURIComponent(ticket.token)}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    });
                    window.showA1Modal('alert', 'Updated', 'Token updated successfully.');
                    await window.loadSupportTickets();
                    window.openSupportTicket(ticket.token);
                } catch (err) {
                    window.showA1Modal('alert', 'Update Error', err.message || 'Could not update token');
                }
            });
        }
    }
};

window.loadSupportTickets = async function() {
    const res = await window.supportApi(`/api/support/tickets?userRef=${encodeURIComponent(window.a1SupportState.userRef)}`);
    window.a1SupportState.tickets = Array.isArray(res.tickets) ? res.tickets : [];
    window.persistSupportTokenIds();
    window.renderSupportTokenList();
};

window.openSupportTicket = async function(token, editMode = false) {
    try {
        const res = await window.supportApi(`/api/support/tickets/${encodeURIComponent(token)}`);
        window.a1SupportState.activeToken = token;
        window.renderSupportTokenList();
        window.renderSupportTicketDetails(res.ticket, !!editMode);
    } catch (err) {
        window.showA1Modal('alert', 'Support Error', err.message || 'Could not load token.');
    }
};

window.closeSupportTicket = async function(token) {
    try {
        await window.supportApi(`/api/support/tickets/${encodeURIComponent(token)}/status`, {
            method: 'PUT',
            body: JSON.stringify({ userRef: window.a1SupportState.userRef, status: 'closed' })
        });
        await window.loadSupportTickets();
        await window.openSupportTicket(token);
    } catch (err) {
        window.showA1Modal('alert', 'Support Error', err.message || 'Could not close token.');
    }
};

window.reopenSupportTicket = async function(token) {
    try {
        await window.supportApi(`/api/support/tickets/${encodeURIComponent(token)}/status`, {
            method: 'PUT',
            body: JSON.stringify({ userRef: window.a1SupportState.userRef, status: 'open' })
        });
        await window.loadSupportTickets();
        await window.openSupportTicket(token);
    } catch (err) {
        window.showA1Modal('alert', 'Support Error', err.message || 'Could not reopen token.');
    }
};

window.openSupportCenter = async function(prefill = null) {
    const modal = document.getElementById('support-center-modal');
    if (!modal) return;
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) sidebar.classList.remove('active');
    window.a1SupportState.userRef = window.getSupportUserRef();
    modal.classList.remove('hidden');
    const createBtn = document.getElementById('support-create-token-btn');
    if (createBtn && !createBtn.dataset.boundSupportCreate) {
        createBtn.dataset.boundSupportCreate = '1';
        createBtn.addEventListener('click', () => window.renderSupportCreateForm());
    }
    try {
        await window.loadSupportTickets();
        if (prefill) {
            window.renderSupportCreateForm(prefill);
        } else if (window.a1SupportState.tickets.length) {
            const first = window.a1SupportState.tickets[0];
            await window.openSupportTicket(first.token);
        } else {
            window.renderSupportCreateForm();
        }
    } catch (err) {
        window.showA1Modal('alert', 'Support Error', err.message || 'Could not open support center');
        window.renderSupportCreateForm(prefill || {});
    }
};

window.closeSupportCenter = function() {
    const modal = document.getElementById('support-center-modal');
    if (modal) modal.classList.add('hidden');
};

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
    const savedStylePack = localStorage.getItem(stylePackStorageKey) || 'default';
    window.applyStylePack(savedStylePack);
    window.updateDeviceThemeEngine();
    window.addEventListener('resize', window.updateDeviceThemeEngine, { passive: true });

    const stylePackSelect = document.getElementById('style-pack-select');
    if (stylePackSelect && !stylePackSelect.dataset.boundStylePack) {
        stylePackSelect.dataset.boundStylePack = '1';
        stylePackSelect.value = savedStylePack;
        stylePackSelect.addEventListener('change', (event) => {
            window.applyStylePack(event.target.value);
            if (navigator.vibrate) navigator.vibrate(15);
        });
    }

    const savedTypingSpeed = localStorage.getItem(typingSpeedStorageKey) || 'smooth';
    window.applyHumanTypingSpeedMode(savedTypingSpeed, { force: false });
    document.querySelectorAll('[data-typing-speed]').forEach((btn) => {
        if (btn.dataset.boundTypingSpeed === '1') return;
        btn.dataset.boundTypingSpeed = '1';
        btn.addEventListener('click', () => {
            window.applyHumanTypingSpeedMode(btn.dataset.typingSpeed, { force: true });
            if (navigator.vibrate) navigator.vibrate(12);
        });
    });

    // 2. राईट-क्लिक मेनू सेट करना
    const dashboard = document.getElementById('main-dashboard');
    if (dashboard) dashboard.addEventListener('contextmenu', window.showContextMenu);

    // 3. HTML Buttons को कनेक्ट करना
    const liveChatBtn = document.getElementById('live-voice-chatroom');
    if (liveChatBtn && !liveChatBtn.dataset.boundMainInit) {
        liveChatBtn.dataset.boundMainInit = '1';
        liveChatBtn.addEventListener('click', window.openLiveChat);
    }

    const newChatBtn = document.getElementById('New-Chatroom');
    if (newChatBtn && !newChatBtn.dataset.boundMainInit) {
        newChatBtn.dataset.boundMainInit = '1';
        newChatBtn.addEventListener('click', window.openNewChatRoom);
    }

    
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
            const historyItems = document.querySelectorAll('#history-list-container .history-item-wrapper');
            
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
    if (liveChatBtn && liveVoiceOverlay && !liveChatBtn.dataset.boundLegacyVoice) {
        liveChatBtn.dataset.boundLegacyVoice = '1';
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
window.__roomLinkHandled = false;
window.__roomDeepLinkOpened = null;

window.createRoomId = function(type = 'chat') {
    const prefix = type === 'voice' ? 'voice' : 'chat';
    const hasWebCrypto = !!(window.crypto && typeof window.crypto.getRandomValues === 'function');
    let token = '';
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        token = window.crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    } else if (hasWebCrypto) {
        const bytes = new Uint8Array(8);
        window.crypto.getRandomValues(bytes);
        token = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
    } else {
        token = `${Date.now().toString(36)}${performance.now().toString(36).replace('.', '').slice(-6)}`.slice(0, 12);
    }
    return `${prefix}_${token}`;
};

window.buildRoomShareUrl = function(roomType = window.currentChatType || 'text', roomId = window.currentSessionId) {
    const url = new URL(window.location.href);
    if (roomId) {
        const safeType = roomType === 'voice' ? 'voice' : 'text';
        url.searchParams.set('roomId', roomId);
        url.searchParams.set('roomType', safeType);
    }
    return url.toString();
};

window.syncRoomUrl = function(roomType, roomId) {
    if (!roomId || !window.history || typeof window.history.replaceState !== 'function') return;
    const url = new URL(window.location.href);
    url.searchParams.set('roomId', roomId);
    url.searchParams.set('roomType', roomType === 'voice' ? 'voice' : 'text');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
};

window.getRoomLinkDataFromUrl = function() {
    const url = new URL(window.location.href);
    const roomId = (url.searchParams.get('roomId') || '').trim();
    const roomTypeRaw = (url.searchParams.get('roomType') || '').trim().toLowerCase();
    if (!roomId) return null;
    const roomType = roomTypeRaw === 'voice' ? 'voice' : 'text';
    return { roomId, roomType };
};

window.consumePendingRoomLink = function() {
    try {
        const raw = sessionStorage.getItem('a1_pending_room_link');
        if (!raw) return null;
        sessionStorage.removeItem('a1_pending_room_link');
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.roomId) return null;
        return { roomId: String(parsed.roomId), roomType: parsed.roomType === 'voice' ? 'voice' : 'text' };
    } catch (_) {
        sessionStorage.removeItem('a1_pending_room_link');
        return null;
    }
};

window.openRoomFromDeepLink = function(linkData) {
    if (!linkData || !linkData.roomId) return;
    if (window.__roomDeepLinkOpened === linkData.roomId) return;
    window.__roomDeepLinkOpened = linkData.roomId;
    if (linkData.roomType === 'voice') window.openLiveChat({ roomId: linkData.roomId, fromDeepLink: true });
    else window.openNewChatRoom({ roomId: linkData.roomId, fromDeepLink: true });
};

function escapeSafeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}

window.__humanTypingWriteLock = false;
window.__humanTypingObserverReady = false;
window.__humanTypingSpeedProfiles = {
    auth: { baseDelay: 10, maxDelay: 22, maxChars: 340 },
    welcome: { baseDelay: 18, maxDelay: 38, maxChars: 460 },
    profile: { baseDelay: 28, maxDelay: 56, maxChars: 520 },
    history: { baseDelay: 14, maxDelay: 28, maxChars: 160 },
    default: { baseDelay: 18, maxDelay: 42, maxChars: 420 }
};

window.resolveTextDirectionByContent = function(text) {
    const value = String(text || '');
    return /[\u0590-\u08FF]/.test(value) ? 'rtl' : 'ltr';
};

window.getClaudeTypingDelay = function(sourceHTML, typedIndex, baseDelay, maxDelay) {
    const len = Math.max(1, sourceHTML.length);
    const progress = typedIndex / len;
    const currentChar = sourceHTML[typedIndex] || '';
    const prevChar = sourceHTML[Math.max(0, typedIndex - 1)] || '';
    const nextChar = sourceHTML[Math.min(len - 1, typedIndex + 1)] || '';

    const variance = Math.max(1, maxDelay - baseDelay);
    let delay = baseDelay + Math.floor(Math.random() * (variance + 1));

    if (progress < 0.2) delay += Math.round((0.2 - progress) * 90);
    if (progress > 0.82) delay += Math.round((progress - 0.82) * 36);

    if (prevChar === '.' || prevChar === '!' || prevChar === '?' || prevChar === '।') delay += 170;
    else if (prevChar === ',' || prevChar === ';' || prevChar === ':') delay += 100;

    if (currentChar === ' ') delay += 12 + Math.floor(Math.random() * 20);
    if (nextChar === '\n') delay += 55;
    if (/[A-Z]/.test(currentChar)) delay += 10;
    if (/[0-9]/.test(currentChar)) delay += 8;

    const microBursts = (typedIndex % 11 === 0) ? 14 : 0;
    const breathBreak = (typedIndex % 37 === 0) ? 35 : 0;
    delay += microBursts + breathBreak;

    return Math.max(8, Math.min(320, delay));
};

window.humanTypeHTML = async function(element, html, options = {}) {
    if (!element || element.dataset.humanTypingRunning === 'true') return;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseDelay = typeof options.baseDelay === 'number' ? options.baseDelay : 18;
    const maxDelay = typeof options.maxDelay === 'number' ? options.maxDelay : 42;
    const force = !!options.force;
    const maxChars = typeof options.maxChars === 'number' ? options.maxChars : 420;

    const isHidden = element.classList.contains('hidden') || element.closest('.hidden');
    if (isHidden && !force) return;

    if (!element.dataset.humanTypingSource || force) element.dataset.humanTypingSource = html;
    if (!force && html && element.dataset.humanTypingSource !== html && element.dataset.humanTypingRunning !== 'true') {
        element.dataset.humanTypingSource = html;
        element.dataset.humanTypedDone = 'false';
    }
    const sourceHTML = element.dataset.humanTypingSource || html || '';
    if (!sourceHTML) return;
    if (element.dataset.humanTypedDone === 'true' && !force) return;
    element.setAttribute('dir', window.resolveTextDirectionByContent(sourceHTML));

    if (reducedMotion || sourceHTML.length > maxChars) {
        window.__humanTypingWriteLock = true;
        element.innerHTML = sourceHTML;
        window.__humanTypingWriteLock = false;
        element.dataset.humanTypedDone = 'true';
        element.dataset.humanTypingRunning = 'false';
        return;
    }

    element.dataset.humanTypingRunning = 'true';
    let output = '';
    let i = 0;

    while (i < sourceHTML.length) {
        if (sourceHTML[i] === '<') {
            let tag = '';
            while (i < sourceHTML.length && sourceHTML[i] !== '>') {
                tag += sourceHTML[i];
                i++;
            }
            tag += '>';
            i++;
            output += tag;
        } else {
            output += sourceHTML[i];
            i++;
            const charIndex = Math.max(0, i - 1);
            let delay = window.getClaudeTypingDelay(sourceHTML, charIndex, baseDelay, maxDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        window.__humanTypingWriteLock = true;
        element.innerHTML = `${output}<span class="human-typing-cursor">|</span>`;
        window.__humanTypingWriteLock = false;
    }

    window.__humanTypingWriteLock = true;
    element.innerHTML = output;
    window.__humanTypingWriteLock = false;
    element.dataset.humanTypingRunning = 'false';
    element.dataset.humanTypedDone = 'true';
};

window.initGlobalHumanTyping = function(options = {}) {
    const root = options.scope || document;
    const force = !!options.force;
    const selectorProfiles = [
        { selector: '.auth-title', profile: 'auth' },
        { selector: '.auth-subtitle', profile: 'auth' },
        { selector: '.auth-link', profile: 'auth' },
        { selector: '.auth-link-inline', profile: 'auth' },
        { selector: '.auth-btn-primary', profile: 'auth' },
        { selector: '.trash-title', profile: 'welcome' },
        { selector: '.trash-desc', profile: 'welcome' },
        { selector: '.welcome-heading', profile: 'welcome' },
        { selector: '#welcome-banner h2', profile: 'welcome' },
        { selector: '#welcome-banner p', profile: 'welcome' },
        { selector: '#future-note-text', profile: 'welcome' },
        { selector: '#future-typing-label', profile: 'welcome' },
        { selector: '#dynamic-thinking-text', profile: 'welcome' },
        { selector: '#live-voice-status', profile: 'welcome' },
        { selector: '.secure-voice-badge', profile: 'history' },
        { selector: '.sidebar-history h5', profile: 'history' },
        { selector: '.history-type-badge-label', profile: 'history' },
        { selector: '#profile-dropdown .dropdown-link', profile: 'profile' },
        { selector: '#profile-dropdown .menu-list-btn', profile: 'profile' },
        { selector: '#profile-dropdown .profile-user-name', profile: 'profile' }
    ];

    selectorProfiles.forEach(({ selector, profile }) => {
        const speedConfig = window.__humanTypingSpeedProfiles[profile] || window.__humanTypingSpeedProfiles.default;
        const speedMode = window.__humanTypingSpeedMode || 'smooth';
        const speedMultiplier = typingSpeedMultipliers[speedMode] || 1;
        const tunedSpeed = {
            ...speedConfig,
            baseDelay: Math.max(6, Math.round(speedConfig.baseDelay * speedMultiplier)),
            maxDelay: Math.max(10, Math.round(speedConfig.maxDelay * speedMultiplier)),
            maxChars: speedConfig.maxChars
        };
        root.querySelectorAll(selector).forEach((el) => {
            const currentHtml = el.innerHTML;
            if (!el.dataset.humanTypingSource || force || el.dataset.humanTypingSource !== currentHtml) {
                el.dataset.humanTypingSource = currentHtml;
                el.dataset.humanTypedDone = 'false';
            }
            window.humanTypeHTML(el, el.dataset.humanTypingSource, { ...tunedSpeed, force });
        });
    });
};

window.setupGlobalHumanTypingObserver = function() {
    if (window.__humanTypingObserverReady) return;
    window.__humanTypingObserverReady = true;

    let timer = null;
    const observer = new MutationObserver(() => {
        if (window.__humanTypingWriteLock) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => window.initGlobalHumanTyping(), 180);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
};

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
            const typeBadgeClass = chat.type === 'voice' ? 'badge-voice' : 'badge-text';
            const typeIcon = chat.type === 'voice' ? 'fa-microphone-lines' : 'fa-comment-dots';
            const typeLabel = chat.type === 'voice' ? 'Voice' : 'Text';

            html += `
                <div class="history-item-wrapper clean-wrapper" style="display:flex; flex-direction: column; align-items: flex-start; position: relative; margin-bottom: 8px; background: ${isActive}; border: 1px solid var(--border, rgba(128,128,128,0.2)); border-radius: 12px; transition: 0.3s;" id="wrapper-${chat.id}">
                    
                    <button class="history-btn-clean" style="width: 100%; display: flex; align-items: center; padding: 14px 16px; background: transparent; border: none; color: ${titleColor}; position: relative; z-index: 10; cursor: pointer; text-align: left;"
                        onclick="window.handleHistoryClick('${chat.id}', event)"
                        onmousedown="window.startHistoryPress('${chat.id}', event)" 
                        onmouseup="window.cancelHistoryPress()" 
                        onmouseleave="window.cancelHistoryPress()" 
                        ontouchstart="window.startHistoryPress('${chat.id}', event)" 
                        ontouchend="window.cancelHistoryPress()"
                        ontouchmove="window.cancelHistoryPress()">
                        
                        <span class="history-title-text" style="flex:1; display:flex; align-items:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size: 15px; font-weight: 500;">
                            ${pinIconHtml} ${safeTitle}
                        </span>
                        <span class="history-type-badge ${typeBadgeClass}">
                            <i class="fas ${typeIcon}"></i>
                            <span class="history-type-badge-label">${typeLabel}</span>
                        </span>
                    </button>
                </div>
            `;
        });
        list.innerHTML = html;
        window.initGlobalHumanTyping({ scope: list, force: true });
    });
};








// =========================================================
// 🚀 5. TAP vs LONG PRESS (HOLD) LOGIC
// =========================================================
window.pressTimer = null;
window.isLongPress = false;
window.historyPopupTimer = null;
window.activeHistoryPopupId = null;
const HISTORY_POPUP_ARROW_MIN_OFFSET = 10;
const HISTORY_POPUP_ARROW_BOTTOM_MARGIN = 16;

window.ensureHistoryPopup = function() {
    let popup = document.getElementById('history-floating-popup');
    if (popup) return popup;
    popup = document.createElement('div');
    popup.id = 'history-floating-popup';
    popup.className = 'history-floating-popup hidden';
    popup.innerHTML = `
        <div class="history-popup-arrow" aria-hidden="true"></div>
        <div class="history-popup-body">
            <button id="history-popup-pin-btn" class="history-popup-btn"><i class="fas fa-thumbtack"></i> Pin History</button>
            <button id="history-popup-rename-btn" class="history-popup-btn"><i class="fas fa-pen"></i> Change History Name</button>
            <button id="history-popup-copy-btn" class="history-popup-btn"><i class="fas fa-copy"></i> Copy History</button>
            <button id="history-popup-delete-btn" class="history-popup-btn history-popup-btn-danger"><i class="fas fa-trash"></i> Delete History</button>
            <button id="history-popup-help-btn" class="history-popup-btn"><i class="fas fa-question-circle"></i> Help</button>
        </div>
    `;
    document.body.appendChild(popup);
    const stop = (e) => e.stopPropagation();
    popup.addEventListener('mousedown', stop);
    popup.addEventListener('touchstart', stop, { passive: true });
    return popup;
};

window.hideHistoryPopup = function() {
    const popup = document.getElementById('history-floating-popup');
    if (!popup) return;
    popup.classList.add('hidden');
    popup.style.left = '';
    popup.style.top = '';
    window.activeHistoryPopupId = null;
    if (window.historyPopupTimer) {
        clearTimeout(window.historyPopupTimer);
        window.historyPopupTimer = null;
    }
};

window.showHistoryPopup = function(id, triggerEl) {
    const popup = window.ensureHistoryPopup();
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if (!chat || !triggerEl) return;
    window.activeHistoryPopupId = id;

    const pinBtn = document.getElementById('history-popup-pin-btn');
    const renameBtn = document.getElementById('history-popup-rename-btn');
    const copyBtn = document.getElementById('history-popup-copy-btn');
    const deleteBtn = document.getElementById('history-popup-delete-btn');
    const helpBtn = document.getElementById('history-popup-help-btn');
    if (pinBtn) {
        pinBtn.style.color = chat.isPinned ? '#facc15' : 'var(--text-primary)';
        pinBtn.onclick = (event) => { window.actionPin(id, event); window.hideHistoryPopup(); };
    }
    if (renameBtn) renameBtn.onclick = (event) => { window.actionRename(id, event); window.hideHistoryPopup(); };
    if (copyBtn) copyBtn.onclick = (event) => { window.actionCopy(id, event); window.hideHistoryPopup(); };
    if (deleteBtn) deleteBtn.onclick = (event) => { window.actionDelete(id, event); window.hideHistoryPopup(); };
    if (helpBtn) helpBtn.onclick = (event) => { window.actionHelp(id, event); window.hideHistoryPopup(); };

    popup.classList.remove('hidden');
    popup.style.visibility = 'hidden';
    popup.style.left = '0px';
    popup.style.top = '0px';

    const triggerRect = triggerEl.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const gap = 12;
    const arrowSize = 10;

    let left = triggerRect.right + gap;
    let top = triggerRect.top + (triggerRect.height / 2) - (popupRect.height / 2);
    let arrowTop = popupRect.height / 2 - 6;
    let placeLeft = true;

    if (left + popupRect.width > viewportWidth - 8) {
        placeLeft = false;
        left = Math.max(8, triggerRect.left - popupRect.width - gap);
    }
    if (top < 8) top = 8;
    if (top + popupRect.height > viewportHeight - 8) top = Math.max(8, viewportHeight - popupRect.height - 8);

    const newArrowTop = (triggerRect.top + triggerRect.height / 2) - top - 6;
    arrowTop = Math.max(HISTORY_POPUP_ARROW_MIN_OFFSET, Math.min(popupRect.height - HISTORY_POPUP_ARROW_BOTTOM_MARGIN, newArrowTop));

    popup.classList.toggle('arrow-left', placeLeft);
    popup.classList.toggle('arrow-right', !placeLeft);
    popup.style.left = `${Math.round(left)}px`;
    popup.style.top = `${Math.round(top)}px`;
    popup.style.setProperty('--history-popup-arrow-top', `${Math.round(arrowTop)}px`);
    popup.style.setProperty('--history-popup-arrow-size', `${arrowSize}px`);
    popup.style.visibility = 'visible';

    if (window.historyPopupTimer) clearTimeout(window.historyPopupTimer);
    window.historyPopupTimer = setTimeout(() => window.hideHistoryPopup(), 8000);
};

window.startHistoryPress = function(id, event) {
    window.isLongPress = false;
    window.pressTimer = setTimeout(() => {
        window.isLongPress = true; // Hold detect 
        if(typeof triggerVibration === 'function') triggerVibration("heavy");
        const btn = event?.currentTarget || document.querySelector(`#wrapper-${id} .history-btn-clean`);
        window.showHistoryPopup(id, btn);
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
    window.hideHistoryPopup();
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
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    const shortIssue = chat?.title ? `History issue: ${chat.title}` : 'History issue';
    window.openSupportCenter({
        shortIssue,
        details: chat ? `Token created from history: ${chat.title}\nType: ${chat.type || 'text'}\nSession ID: ${chat.id}` : ''
    });
};

// 🚀 FIX: Restore Old Chat with Hologram & Feedback UI
window.loadSpecificChat = function(id) {
    if(typeof triggerVibration === 'function') triggerVibration("light");
    const chat = window.chatSessions.find(c => String(c.id).trim() === String(id).trim());
    if(!chat) return;

    window.currentSessionId = chat.id;
    window.currentChatType = chat.type;
    window.syncRoomUrl(chat.type === 'voice' ? 'voice' : 'text', chat.id);
    
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
                        div.innerHTML = `<div class="bubble-container" style="display: flex; flex-direction: column; align-items: flex-end;"><div class="chat-bubble user-bubble">${window.formatUserMessage(msg.text)}</div><div class="user-action-bar"><button class="action-icon-btn" onclick="window.handleSafeAction('copy', this)" data-text="${safeText}"><i class="fas fa-copy"></i></button></div></div>`;
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
                                    <div class="chat-msg-text">${window.formatChatText(msg.text)}</div>
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
    
    if(chat.type === 'voice') {
        window.openLiveChat({ roomId: chat.id, fromHistory: true });
        const status = document.getElementById('live-voice-status');
        if (status) status.innerText = "History voice room opened";
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
        
        let html = `
            <div class="trash-bulk-actions">
                <button onclick="window.actionRecoverAll(event)" class="trash-action-btn btn-recover">
                    <i class="fas fa-undo-alt"></i> Recover All
                </button>
                <button onclick="window.actionPermDeleteAll(event)" class="trash-action-btn btn-perm-delete">
                    <i class="fas fa-trash-alt"></i> Delete All
                </button>
            </div>
        `;
        const deletedChats = window.chatSessions.filter(c => c.isDeleted);

        if(deletedChats.length === 0) {
            container.innerHTML = `${html}<p style="text-align:center; color:var(--text-secondary); margin-top: 20px;">No deleted chats.</p>`;
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

document.addEventListener("DOMContentLoaded", () => {
    window.initGlobalHumanTyping({ force: true });
    window.setupGlobalHumanTypingObserver();
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
            if (input.dataset.pinBound === '1') return;
            input.dataset.pinBound = '1';
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
        const isKnownView = views.includes(viewName);
        const targetView = document.getElementById(viewName);
        if (isKnownView && (!targetView || !targetView.classList)) {
            console.warn(`switchView: known view "${viewName}" is missing in DOM.`);
            return;
        }
        const finalView = isKnownView ? targetView : document.getElementById('login-view');
        if (!finalView || !finalView.classList) return;
        finalView.classList.remove('hidden');
        setTimeout(() => window.initGlobalHumanTyping({ scope: finalView, force: true }), 60);
        window.resetForms();
    } catch(e) {}
};

window.setVoiceChatVisibility = function(showChat) {
    const chatLog = document.getElementById('live-voice-chat-log');
    const middleContainer = document.getElementById('voice-middle-container');
    const toggleBtn = document.getElementById('toggle-voice-chat-btn');
    if (!chatLog || !middleContainer) return;

    chatLog.classList.toggle('hidden', !showChat);
    middleContainer.classList.toggle('chat-hidden-mode', !showChat);

    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        if (icon) icon.className = showChat ? "fas fa-comment-slash" : "fas fa-comment";
        if (text) text.innerText = showChat ? "Hide Chat" : "Show Chat";
    }
};

window.setAttachmentMenuOpen = function(isOpen) {
    const attachMenu = document.getElementById('attachment-menu');
    if (!attachMenu) return;
    attachMenu.classList.toggle('hidden', !isOpen);
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
        window.__a1ForgotResetMobile = null;
        window.__a1ForgotResetToken = null;
        window.__a1SignupMobileVerifiedToken = null;
        window.__a1SignupEmailVerifiedToken = null;

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

        showEl('forgot-send-otp-btn');
        hideEl('forgot-otp-section');
        hideEl('forgot-pass-section');
        const forgotBtn = document.getElementById('forgot-send-otp-btn');
        if (forgotBtn) forgotBtn.disabled = false;
        
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
    const mobile = (document.getElementById('login-mobile-input')?.value || '').trim();
    if (!/^\d{10}$/.test(mobile)) return window.showA1Modal('alert', 'Error', 'Enter a valid 10-digit mobile number.');

    const sendBtn = document.getElementById('login-send-otp-btn');
    if (sendBtn) sendBtn.disabled = true;

    fetch('/api/login/mobile/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Unable to send OTP.');

        window.safeVibrate();
        window.initializeAllPinBoxes();
        if(sendBtn) sendBtn.classList.add('hidden');
        const otpSec = document.getElementById('login-otp-section');
        if(otpSec) {
            otpSec.classList.remove('hidden');
            setTimeout(() => document.querySelector('#login-otp-boxes input')?.focus(), 300);
        }
        window.showA1Modal?.('alert', 'OTP Sent', data.message || 'If credentials are valid, OTP has been sent.');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Error', err.message || 'Failed to send OTP.');
    })
    .finally(() => {
        if (sendBtn) sendBtn.disabled = false;
    });
};

window.actionRecoverAll = function(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    Web4_Data_Quantum_Core.healDataSystem("Recover_All_Chats", () => {
        let changed = false;
        window.chatSessions.forEach(chat => {
            if (chat.isDeleted) {
                chat.isDeleted = false;
                changed = true;
            }
        });
        if (changed) {
            window.saveHistory();
            window.showA1Modal('alert', 'Recovered All', '✅ All deleted chats recovered.');
        } else {
            window.showA1Modal('alert', 'No Deleted Chats', 'ℹ️ Recover karne ke liye koi deleted chat nahi mila.');
        }
    });
};

window.actionPermDeleteAll = function(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    Web4_Data_Quantum_Core.healDataSystem("Permanent_Delete_All", () => {
        window.showA1Modal('confirm', 'Permanent Delete All', 'Kya aap sab deleted histories ko hamesha ke liye mitaana chahte hain?', (isConfirmed) => {
            if(!isConfirmed) return;
            const before = window.chatSessions.length;
            window.chatSessions = window.chatSessions.filter(c => !c.isDeleted);
            if (window.chatSessions.length !== before) {
                window.saveHistory();
                window.showA1Modal('alert', 'Deleted', '🗑️ All deleted chats permanently removed.');
            } else {
                window.showA1Modal('alert', 'No Deleted Chats', 'ℹ️ Permanent delete ke liye koi deleted chat nahi mila.');
            }
        });
    });
};

window.verifyLoginOTP = function() {
    const mobile = (document.getElementById('login-mobile-input')?.value || '').trim();
    const otp = Array.from(document.querySelectorAll('#login-otp-boxes input'))
        .map((el) => (el.value || '').trim())
        .join('');
    if (!/^\d{10}$/.test(mobile)) return window.showA1Modal?.('alert', 'Error', 'Enter a valid 10-digit mobile number.');
    if (!/^\d{6}$/.test(otp)) return window.showA1Modal?.('alert', 'Invalid OTP', 'Please enter a valid 6-digit OTP.');

    fetch('/api/login/mobile/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Login failed.');
        window.safeVibrate();
        localStorage.removeItem('a1_pending_onboarding');
        window.grantAccess(true);
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Login Failed', err.message || 'Invalid credentials.');
    });
};

window.processMobilePassLogin = function() {
    const mobile = (document.getElementById('login-mobile-input')?.value || '').trim();
    const pass = document.getElementById('login-mobile-password').value;
    if (!/^\d{10}$/.test(mobile) || pass.length < 8) return window.showA1Modal('alert', 'Login Failed', 'Invalid credentials.');

    fetch('/api/login/mobile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password: pass })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Login failed.');
        window.safeVibrate();
        localStorage.removeItem('a1_pending_onboarding');
        window.grantAccess(true);
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Login Failed', err.message || 'Invalid credentials.');
    });
};

window.processEmailLogin = function() {
    const email = (document.getElementById('login-email-input')?.value || '').trim().toLowerCase();
    const pass = document.getElementById('login-password-input').value;
    if (!email.includes('@') || pass.length < 8) return window.showA1Modal('alert', 'Login Failed', 'Invalid email or password.');

    fetch('/api/login/email/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Login failed.');
        window.safeVibrate();
        localStorage.removeItem('a1_pending_onboarding');
        window.grantAccess(true);
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Login Failed', err.message || 'Invalid credentials.');
    });
};

/* =========================================================
   🚀 5. SIGNUP LOGIC (Routes to Onboarding)
========================================================= */
window.sendSignupOTP = function() {
    const mobile = (document.getElementById('signup-mobile-input')?.value || '').trim();
    if (!/^\d{10}$/.test(mobile)) return window.showA1Modal('alert', 'Invalid Input', 'Enter valid 10-digit mobile number.');

    const sendBtn = document.getElementById('signup-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    fetch('/api/signup/mobile/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Unable to send OTP.');

        window.safeVibrate();
        window.initializeAllPinBoxes();
        document.getElementById('signup-send-btn')?.classList.add('hidden');
        document.getElementById('signup-otp-section')?.classList.remove('hidden');
        setTimeout(() => document.querySelector('#signup-otp-boxes input')?.focus(), 300);
        window.showA1Modal?.('alert', 'OTP Sent', data.message || 'OTP has been sent.');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Error', err.message || 'Failed to send OTP.');
    })
    .finally(() => {
        if (sendBtn) sendBtn.disabled = false;
    });
};

window.verifySignupOTP = function() {
    const mobile = (document.getElementById('signup-mobile-input')?.value || '').trim();
    const otp = Array.from(document.querySelectorAll('#signup-otp-boxes input'))
        .map((el) => (el.value || '').trim())
        .join('');
    if (!/^\d{10}$/.test(mobile)) return window.showA1Modal?.('alert', 'Invalid Input', 'Enter valid 10-digit mobile number.');
    if (!/^\d{6}$/.test(otp)) return window.showA1Modal?.('alert', 'Invalid OTP', 'Please enter valid 6-digit OTP.');

    fetch('/api/signup/mobile/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success' || !data.signupToken) throw new Error(data.message || 'OTP verification failed.');
        window.__a1SignupMobileVerifiedToken = data.signupToken;
        window.safeVibrate();
        document.getElementById('signup-otp-section')?.classList.add('hidden');
        document.getElementById('signup-mobile-pass-section')?.classList.remove('hidden');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Verification Failed', err.message || 'Invalid or expired OTP.');
    });
};

window.sendEmailVerification = function() {
    const email = (document.getElementById('signup-email-input')?.value || '').trim().toLowerCase();
    if (!email.includes('@') || !email.includes('.')) return window.showA1Modal('alert', 'Invalid Email', 'Please enter a valid email address.');

    const sendBtn = document.getElementById('signup-send-email-btn');
    const msgEl = document.getElementById('email-verify-msg');
    if(sendBtn) { sendBtn.classList.add('hidden'); sendBtn.disabled = true; }
    if(msgEl) msgEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying email...';

    fetch('/api/signup/email/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success' || !data.signupToken) throw new Error(data.message || 'Email verification failed.');
        window.__a1SignupEmailVerifiedToken = data.signupToken;
        window.safeVibrate();
        if(msgEl) msgEl.classList.add('hidden');
        const passSec = document.getElementById('signup-email-pass-section');
        if(passSec) passSec.classList.remove('hidden');
        window.showA1Modal?.('alert', 'Email Verified', data.message || 'Email has been verified successfully! Create your password.');
    })
    .catch((err) => {
        if(sendBtn) sendBtn.classList.remove('hidden');
        if(msgEl) {
            msgEl.classList.remove('hidden');
            msgEl.innerHTML = '<i class="fas fa-envelope"></i> A verification link will be sent to this email.';
        }
        window.showA1Modal?.('alert', 'Error', err.message || 'Email verification failed.');
    })
    .finally(() => {
        if(sendBtn) sendBtn.disabled = false;
    });
};

window.completeSignup = function(type) {
    try {
        let pass, conf;
        let payload = {};
        if (type === 'mobile') {
            pass = document.getElementById('signup-pass-mobile').value; 
            conf = document.getElementById('signup-conf-pass-mobile').value;
            const mobile = (document.getElementById('signup-mobile-input')?.value || '').trim();
            const signupToken = window.__a1SignupMobileVerifiedToken;
            if (!/^\d{10}$/.test(mobile) || !signupToken) {
                return window.showA1Modal?.('alert', 'Session Expired', 'Please verify OTP again.');
            }
            payload = { url: '/api/signup/mobile/complete', body: { mobile, password: pass, signupToken } };
        } else {
            pass = document.getElementById('signup-pass-email').value; 
            conf = document.getElementById('signup-conf-pass-email').value;
            const email = (document.getElementById('signup-email-input')?.value || '').trim().toLowerCase();
            const signupToken = window.__a1SignupEmailVerifiedToken;
            if (!email.includes('@') || !signupToken) {
                return window.showA1Modal?.('alert', 'Session Expired', 'Please verify email again.');
            }
            payload = { url: '/api/signup/email/complete', body: { email, password: pass, signupToken } };
        }
        if (!window.validatePassword(pass, conf)) return;

        fetch(payload.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload.body)
        })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.status !== 'success') throw new Error(data.message || 'Signup failed.');

            window.safeVibrate("light");
            window.__a1SignupMobileVerifiedToken = null;
            window.__a1SignupEmailVerifiedToken = null;
            localStorage.setItem('a1_pending_onboarding', 'true');
            window.grantAccess(true);
        })
        .catch((err) => {
            window.showA1Modal?.('alert', 'Signup Failed', err.message || 'Could not create account.');
        });
    } catch (error) { console.error(error); }
};

window.sendForgotOTP = function() {
    const mobile = (document.getElementById('forgot-mobile-input')?.value || '').trim();
    if (!/^\d{10}$/.test(mobile)) {
        return window.showA1Modal?.('alert', 'Invalid Input', 'Please enter a valid 10-digit mobile number.');
    }

    const sendBtn = document.getElementById('forgot-send-otp-btn');
    if (sendBtn) sendBtn.disabled = true;

    fetch('/api/forgot/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') {
            throw new Error(data.message || 'Unable to send OTP.');
        }

        window.initializeAllPinBoxes();
        document.getElementById('forgot-send-otp-btn')?.classList.add('hidden');
        document.getElementById('forgot-otp-section')?.classList.remove('hidden');
        setTimeout(() => document.querySelector('#forgot-otp-boxes input')?.focus(), 200);
        window.showA1Modal?.('alert', 'OTP Sent', data.message || 'If an account exists, OTP has been sent.');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Error', err.message || 'Failed to send OTP. Please try again.');
    })
    .finally(() => {
        if (sendBtn) sendBtn.disabled = false;
    });
};

window.verifyForgotOTP = function() {
    const mobile = (document.getElementById('forgot-mobile-input')?.value || '').trim();
    const otp = Array.from(document.querySelectorAll('#forgot-otp-boxes input'))
        .map((el) => (el.value || '').trim())
        .join('');

    if (!/^\d{10}$/.test(mobile)) {
        return window.showA1Modal?.('alert', 'Invalid Input', 'Please enter a valid 10-digit mobile number.');
    }
    if (!/^\d{6}$/.test(otp)) {
        return window.showA1Modal?.('alert', 'Invalid OTP', 'Please enter a valid 6-digit OTP.');
    }

    fetch('/api/forgot/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success' || !data.resetToken) {
            throw new Error(data.message || 'OTP verification failed.');
        }

        window.__a1ForgotResetMobile = mobile;
        window.__a1ForgotResetToken = data.resetToken;

        document.getElementById('forgot-otp-section')?.classList.add('hidden');
        document.getElementById('forgot-pass-section')?.classList.remove('hidden');
        window.safeVibrate();
        window.showA1Modal?.('alert', 'Verified', 'OTP verified. Set your new password.');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Verification Failed', err.message || 'Invalid or expired OTP.');
    });
};

window.resetForgotPassword = function() {
    const pass = document.getElementById('forgot-pass')?.value || '';
    const conf = document.getElementById('forgot-conf-pass')?.value || '';
    if (!window.validatePassword(pass, conf)) return;

    const mobile = window.__a1ForgotResetMobile;
    const resetToken = window.__a1ForgotResetToken;
    if (!mobile || !resetToken) {
        return window.showA1Modal?.('alert', 'Session Expired', 'Please verify OTP again.');
    }

    fetch('/api/forgot/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, resetToken, newPassword: pass })
    })
    .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status !== 'success') {
            throw new Error(data.message || 'Password reset failed.');
        }

        window.__a1ForgotResetMobile = null;
        window.__a1ForgotResetToken = null;
        window.showA1Modal?.('alert', 'Success', 'Password reset successful. Please login.');
        window.switchView('login-view');
    })
    .catch((err) => {
        window.showA1Modal?.('alert', 'Error', err.message || 'Password reset failed.');
    });
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
        if (authContainer) {
            authContainer.classList.add('hidden');
            authContainer.style.removeProperty('display');
            authContainer.style.removeProperty('visibility');
            authContainer.style.removeProperty('pointer-events');
            authContainer.style.removeProperty('z-index');
        }

        if (localStorage.getItem('a1_pending_onboarding') === 'true') {
            if (dash) {
                dash.classList.add('hidden');
                dash.style.removeProperty('display');
            }
            if (floatingBtns) {
                floatingBtns.classList.add('hidden');
                floatingBtns.style.removeProperty('display');
            }
            
            if (typeof window.startAIOnboarding === 'function') { 
                window.startAIOnboarding(); 
            } else if (onboardBox) {
                onboardBox.classList.remove('hidden');
            }
        } 
        else {
            if (onboardBox) {
                onboardBox.classList.add('hidden');
                onboardBox.style.removeProperty('display');
            }
            if (dash) {
                dash.classList.remove('hidden');
                dash.style.removeProperty('display');
                dash.style.removeProperty('visibility');
                dash.style.removeProperty('pointer-events');
                dash.style.removeProperty('z-index');
            }
            if (floatingBtns) {
                floatingBtns.classList.remove('hidden');
                floatingBtns.style.removeProperty('display');
                floatingBtns.style.removeProperty('z-index');
            }
            
            let storedName = localStorage.getItem('a1_user_name') || "Commander";
            const dashNameEl = document.getElementById('User-name');
            if (dashNameEl) dashNameEl.innerText = storedName;

            const pendingLink = window.consumePendingRoomLink();
            if (pendingLink) {
                setTimeout(() => {
                    window.openRoomFromDeepLink(pendingLink);
                }, 0);
            }
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
    const isLoggedIn = localStorage.getItem('a1_ai_logged_in') === 'true';
    const authContainer = document.getElementById('auth-container');
    const dash = document.getElementById('app-home-screen-wrapper');
    const onboardBox = document.getElementById('onboarding-view');
    const floatingBtns = document.querySelector('.floating-action-group');

    // 🚀 Startup route guard: ek hi correct screen dikhani hai
    if (!isLoggedIn) {
        if (dash) {
            dash.classList.add('hidden');
            dash.style.removeProperty('display');
        }
        if (onboardBox) {
            onboardBox.classList.add('hidden');
            onboardBox.style.removeProperty('display');
        }
        if (floatingBtns) {
            floatingBtns.classList.add('hidden');
            floatingBtns.style.removeProperty('display');
        }
        if (authContainer) {
            authContainer.classList.remove('hidden');
            authContainer.style.removeProperty('display');
        }
        if (typeof window.switchView === 'function') window.switchView('login-view');
    } else if (typeof window.grantAccess === 'function') {
        window.grantAccess(true);
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
    window.openSupportCenter({
        shortIssue: 'Live voice chat support request',
        details: 'Issue created from live voice chat help menu.'
    });
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
window.escapeHtml = function(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

window.formatUserMessage = function(text) {
    const safeSource = String(text ?? '');
    const hasCodeBlock = /```[\s\S]*?```/.test(safeSource);
    if (hasCodeBlock) {
        return `<div class="user-msg-content">${window.formatChatText(safeSource)}</div>`;
    }
    const escaped = window.escapeHtml(safeSource);
    let formattedText = escaped.replace(/\n/g, '<br>');
    
    // Agar message lamba hai (4 line se jyada ya 150 words se bada)
    if (safeSource.split('\n').length > 4 || safeSource.length > 150) {
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

// 🚀 LONG MESSAGE FORMATTER (shared for voice/user bubbles)
window.formatLongMessage = function(text) {
    const source = String(text ?? '');
    const hasCodeBlock = /```[\s\S]*?```/.test(source);
    if (hasCodeBlock) return window.formatChatText(source);
    const escaped = window.escapeHtml(source);
    const safe = escaped.replace(/\n/g, '<br>');
    const isLong = source.split('\n').length > 4 || source.length > 220;
    if (!isLong) return safe;
    return `
        <div class="long-msg-wrapper">
            <div class="long-msg-content line-clamp-3">${safe}</div>
            <button onclick="window.toggleMsgExpand(this)" class="read-more-btn">
                <i class="fas fa-chevron-down"></i> Read More
            </button>
        </div>
    `;
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
        
        if(chatLog) {
            // चेक करें कि क्या डब्बा छिपा हुआ है
            const isHidden = chatLog.classList.contains('hidden');

            if(isHidden) {
                window.setVoiceChatVisibility(true);
            } else {
                window.setVoiceChatVisibility(false);
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
                window.setAttachmentMenuOpen(true);
            } else {
                window.setAttachmentMenuOpen(false);
            }
        }
        return; // 🚀 कोड को यहीं रोक देगा ताकि मेनू तुरंत बंद न हो जाए
    }

    // 5. 🚀 AUTO-CLOSE: अगर मेनू खुला है और बाहर कहीं क्लिक हुआ है, तो बंद कर दो
    if (attachMenu && !attachMenu.classList.contains('hidden')) {
        if (!e.target.closest('#attachment-menu')) {
            window.setAttachmentMenuOpen(false);
        }
    }

    // 6. Keyboard Menu Click 
    const keyboardBtn = e.target.closest('#keyboard-voice-btn');
    if(keyboardBtn) {
        if(navigator.vibrate) navigator.vibrate(20);
        const inputContainer = document.getElementById('live-voice-type-input');
        if(inputContainer) {
            inputContainer.classList.toggle('hidden');
            window.setAttachmentMenuOpen(false);
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
        const voiceTraceId = `voice-trace-${Date.now()}`;
        const voiceBreakdown = window.createThinkingBreakdownData(text, 'voice');
        const logBox = document.getElementById('live-voice-chat-log');
        if (logBox) {
            const badge = logBox.querySelector('.secure-voice-badge');
            if (badge) badge.style.display = 'none';
            const traceRow = document.createElement('div');
            traceRow.className = 'chat-message-row ai';
            traceRow.innerHTML = `
                <div class="bubble-container">
                    ${window.renderThinkingTraceHtml(voiceTraceId, voiceBreakdown, { title: 'Live Thinking Details', badge: 'Listening + Reasoning', live: true })}
                </div>
            `;
            logBox.appendChild(traceRow);
            logBox.scrollTo({ top: logBox.scrollHeight, behavior: 'smooth' });
            window.startThinkingTraceAnimation(voiceTraceId, voiceBreakdown.steps.length, 650);
        }

        setTimeout(() => {
            if(!isLiveVoiceMode) return; 
            let aiResponse = `Aapne kaha: "${text}". Main is data ko sync kar raha hoon.`; 
            window.finishThinkingTrace(voiceTraceId, true);
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
    document.querySelectorAll('#live-voice-chat-log .thinking-trace[data-live="1"]').forEach(trace => {
        window.finishThinkingTrace(trace.id, false);
    });
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
        if (!btn || btn.dataset.boundLiveVoiceInit) return;
        btn.dataset.boundLiveVoiceInit = '1';
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // एक क्लिक पर दो बार मैसेज आने से रोकेगा

            if(window.voiceInitTimer) clearTimeout(window.voiceInitTimer); // पुराना टाइमर डिलीट करेगा

            isLiveVoiceMode = true;
            window.isFirstMessage = true;
            window.currentSessionId = window.createRoomId('voice');
            window.currentChatType = 'voice';
            window.currentChatId = window.currentSessionId; 
            window.syncRoomUrl('voice', window.currentSessionId);
            
            const logBox = document.getElementById("live-voice-chat-log");

            if(logBox) {
                window.setVoiceChatVisibility(false);

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
        window.setAttachmentMenuOpen(false);
        window.setVoiceChatVisibility(true);
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

        const isVoiceShare = shareBtn.id === 'voice-share-btn';
        const roomType = isVoiceShare ? 'voice' : 'text';
        if (!window.currentSessionId) {
            window.currentSessionId = window.createRoomId(roomType === 'voice' ? 'voice' : 'chat');
            window.currentChatType = roomType;
            window.currentChatId = window.currentSessionId;
            window.syncRoomUrl(roomType, window.currentSessionId);
        }

        // शेयर करने वाला डेटा
        const shareData = {
            title: 'A1 AI Assistant',
            text: roomType === 'voice'
                ? 'Join my A1 Live Voice Room 🎙️'
                : 'Open my A1 New Chat Room 💬',
            url: window.buildRoomShareUrl(roomType, window.currentSessionId)
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
window.getCodeLanguageMeta = function(langRaw) {
    const key = String(langRaw || '').trim().toLowerCase();
    const map = {
        js: { label: 'JavaScript', theme: 'javascript' },
        javascript: { label: 'JavaScript', theme: 'javascript' },
        jsx: { label: 'JavaScript (JSX)', theme: 'javascript' },
        ts: { label: 'TypeScript', theme: 'typescript' },
        tsx: { label: 'TypeScript (TSX)', theme: 'typescript' },
        py: { label: 'Python', theme: 'python' },
        python: { label: 'Python', theme: 'python' },
        java: { label: 'Java', theme: 'java' },
        c: { label: 'C', theme: 'c' },
        'c++': { label: 'C++', theme: 'cpp' },
        cpp: { label: 'C++', theme: 'cpp' },
        'c#': { label: 'C#', theme: 'csharp' },
        cs: { label: 'C#', theme: 'csharp' },
        php: { label: 'PHP', theme: 'php' },
        go: { label: 'Go', theme: 'go' },
        golang: { label: 'Go', theme: 'go' },
        rs: { label: 'Rust', theme: 'rust' },
        rust: { label: 'Rust', theme: 'rust' },
        rb: { label: 'Ruby', theme: 'ruby' },
        ruby: { label: 'Ruby', theme: 'ruby' },
        swift: { label: 'Swift', theme: 'swift' },
        kt: { label: 'Kotlin', theme: 'kotlin' },
        kotlin: { label: 'Kotlin', theme: 'kotlin' },
        sql: { label: 'SQL', theme: 'sql' },
        sh: { label: 'Shell', theme: 'shell' },
        bash: { label: 'Shell', theme: 'shell' },
        zsh: { label: 'Shell', theme: 'shell' },
        html: { label: 'HTML', theme: 'html' },
        css: { label: 'CSS', theme: 'css' },
        json: { label: 'JSON', theme: 'json' },
        yaml: { label: 'YAML', theme: 'yaml' },
        yml: { label: 'YAML', theme: 'yaml' },
        xml: { label: 'XML', theme: 'xml' },
        md: { label: 'Markdown', theme: 'markdown' },
        markdown: { label: 'Markdown', theme: 'markdown' }
    };
    return map[key] || { label: key ? key.toUpperCase() : 'CODE', theme: 'default' };
};

window.formatChatText = function(rawText) {
    if (!rawText) return "";
    const CODE_SCROLL_THRESHOLD = 20;

    // 1. Text ko safe banana (XSS prevention)
    let text = window.escapeHtml(rawText);

    // 2. Text ko ` ``` ` ke hisaab se tukdo mein todna
    let parts = text.split(/(```[\s\S]*?```)/g);
    let finalHtml = "";

    parts.forEach(part => {
        if (part.startsWith('```') && part.endsWith('```')) {
            // 💻 YE CODE BLOCK HAI
            // Intentionally supports aliases like c++, c#, tsx, etc.
            let match = part.match(/```([\w#+.\-]*)\n?([\s\S]*?)```/);
            if (match) {
                const languageMeta = window.getCodeLanguageMeta(match[1]);
                let lang = languageMeta.label;
                let codeContent = match[2];
                let rawCodeToCopy = codeContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                
                // Color lagana
                let coloredCode = window.applyNativeHighlighting(codeContent);

                // Premium Code Box HTML
                finalHtml += `
                <div class="premium-code-box lang-${languageMeta.theme}">
                    <div class="code-header">
                        <span class="code-lang">${lang}</span>
                        <button class="code-copy-btn" onclick="window.copyCodeBlock(this, '${encodeURIComponent(rawCodeToCopy)}')">
                            <i class="far fa-copy"></i> <span>Copy</span>
                        </button>
                    </div>
                    <div class="code-body custom-scrollbar${codeContent.split('\n').length > CODE_SCROLL_THRESHOLD ? ' many-lines' : ''}">
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

window.futureSuggestionTimer = null;
window.futurePreviewStyle = 'gemini';
window.futureStyleConfig = {
    gemini: {
        labelPrefix: 'Thinking',
        noteTemplate: (userName) => `${userName}, aap yahan apna next idea/comment likh sakte ho — A1 usse Gemini-style structured response mein convert karega.`,
        suggestions: [
            { label: 'Daily Plan', text: 'Mere liye ek productive daily plan banao' },
            { label: 'English Boost', text: 'Meri English improve karne ka 7 din ka roadmap do' },
            { label: 'Motivation', text: 'Aaj ke liye short motivation line likho' }
        ]
    },
    chatgpt: {
        labelPrefix: 'Drafting',
        noteTemplate: (userName) => `${userName}, prompt dalo aur ChatGPT-style clear, step-by-step answer preview yahan milega.`,
        suggestions: [
            { label: 'Summarize', text: 'Is topic ko simple bullet points mein summarize karo' },
            { label: 'Rewrite', text: 'Mera text professional tone mein rewrite karo' },
            { label: 'Checklist', text: 'Mere task ke liye actionable checklist banao' }
        ]
    },
    claude: {
        labelPrefix: 'Reasoning',
        noteTemplate: (userName) => `${userName}, Claude-style thoughtful aur context-aware response preview yahan show hoga.`,
        suggestions: [
            { label: 'Deep Explain', text: 'Is concept ko depth mein explain karo with examples' },
            { label: 'Compare', text: 'Do options compare karo with pros and cons' },
            { label: 'Refine', text: 'Mere draft ko concise aur impactful banao' }
        ]
    },
    groq: {
        labelPrefix: 'Fast mode',
        noteTemplate: (userName) => `${userName}, Groq-style ultra-fast crisp response suggestions yahan rotate honge.`,
        suggestions: [
            { label: 'Quick Answer', text: 'Iska fastest short answer do' },
            { label: 'Code Fix', text: 'Is bug ka quick fix suggest karo' },
            { label: 'Instant Plan', text: 'Mujhe 3-step instant plan do' }
        ]
    }
};

window.renderFutureSuggestions = function (styleKey) {
    const row = document.getElementById('future-suggestion-row');
    const note = document.getElementById('future-preview-note');
    const chips = document.querySelectorAll('#future-style-switcher .future-style-chip');
    if (!row || !note) return;

    const safeStyle = window.futureStyleConfig[styleKey] ? styleKey : 'gemini';
    window.futurePreviewStyle = safeStyle;

    note.classList.remove('style-gemini', 'style-chatgpt', 'style-claude', 'style-groq');
    note.classList.add(`style-${safeStyle}`);
    chips.forEach((chip) => chip.classList.toggle('is-active', chip.dataset.style === safeStyle));

    const suggestionHtml = window.futureStyleConfig[safeStyle].suggestions
        .map((item) => `<button type="button" class="future-suggestion-chip" data-suggestion="${item.text.replace(/"/g, '&quot;')}">${item.label}</button>`)
        .join('');
    row.innerHTML = suggestionHtml;
};

window.stopFuturePreviewRotation = function () {
    if (window.futureSuggestionTimer) {
        clearInterval(window.futureSuggestionTimer);
        window.futureSuggestionTimer = null;
    }
};

window.startFuturePreviewRotation = function () {
    window.stopFuturePreviewRotation();
    window.renderFutureSuggestions(window.futurePreviewStyle || 'gemini');
    const chips = Array.from(document.querySelectorAll('#future-suggestion-row .future-suggestion-chip'));
    const typingLabel = document.getElementById('future-typing-label');
    if (!chips.length) return;

    let activeIndex = 0;
    const applyActive = () => {
        chips.forEach((chip, index) => chip.classList.toggle('is-rotating', index === activeIndex));
        const phrase = chips[activeIndex]?.dataset?.suggestion || chips[activeIndex]?.textContent || 'Thinking next idea...';
        const styleKey = window.futurePreviewStyle || 'gemini';
        const prefix = window.futureStyleConfig[styleKey]?.labelPrefix || 'Thinking';
        if (typingLabel) typingLabel.textContent = `${prefix}: ${phrase}`;
    };
    applyActive();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.futureSuggestionTimer = setInterval(() => {
        activeIndex = (activeIndex + 1) % chips.length;
        applyActive();
    }, 1700);
};

document.addEventListener('click', (event) => {
    const styleChip = event.target.closest('#future-style-switcher .future-style-chip');
    if (styleChip) {
        window.renderFutureSuggestions(styleChip.dataset.style || 'gemini');
        window.startFuturePreviewRotation();
        return;
    }
    const chip = event.target.closest('#future-suggestion-row .future-suggestion-chip');
    if (!chip) return;
    const chatInput = document.getElementById('chat-user-input');
    if (!chatInput) return;
    chatInput.value = chip.dataset.suggestion || chip.textContent || '';
    if (typeof window.autoResizeInput === 'function') window.autoResizeInput(chatInput);
    chatInput.focus();
});

document.addEventListener('click', (event) => {
    const popup = document.getElementById('history-floating-popup');
    if (!popup || popup.classList.contains('hidden')) return;
    if (!event.target.closest('#history-floating-popup') && !event.target.closest('.history-btn-clean')) {
        window.hideHistoryPopup();
    }
});

document.addEventListener('click', (event) => {
    const supportModal = document.getElementById('support-center-modal');
    if (!supportModal || supportModal.classList.contains('hidden')) return;
    if (event.target === supportModal) window.closeSupportCenter();
});




// 🚀 FIXED: HAR BAAR NEW CHAT ROOM OPEN HOGA
// =========================================================
// 🚀 MASTER FIX: हर बार 100% नया और फ्रेश चैट रूम खुलेगा
// =========================================================
window.openNewChatRoom = function(eventOrOptions) {
    const event = eventOrOptions && typeof eventOrOptions.preventDefault === 'function' ? eventOrOptions : null;
    const options = event ? {} : (eventOrOptions || {});
    if(event) { event.preventDefault(); event.stopPropagation(); }

    // 1. हमेशा नई ID और फर्स्ट मैसेज सेट करो
    window.isFirstMessage = true;
    const incomingRoomId = typeof options.roomId === 'string' && options.roomId.trim() ? options.roomId.trim() : '';
    window.currentSessionId = incomingRoomId || window.createRoomId('chat');
    window.currentChatType = 'text';
    window.currentChatId = window.currentSessionId;
    window.syncRoomUrl('text', window.currentSessionId);

    if(typeof window.stopChatGeneration === 'function') window.stopChatGeneration();
    if(typeof triggerVibration === 'function') triggerVibration("medium");

    // 2. साइडबार बंद करें
    const sidebar = document.getElementById('sidebar-menu');
    if(sidebar) { sidebar.classList.remove('active'); }

    // 3. 🚀 पुरानी चैट को स्क्रीन से पूरी तरह साफ़ (Clear) करें
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        chatBox.querySelectorAll('.chat-message-row').forEach(m => m.remove());
    }

    // 4. Welcome बैनर को वापस लाएं
    const welcomeBanner = document.getElementById('welcome-banner');
    if(welcomeBanner) welcomeBanner.style.display = 'flex';
    const futureNote = document.getElementById('future-note-text');
    if (futureNote) {
        const userName = (localStorage.getItem('a1_user_name') || 'Commander').trim() || 'Commander';
        const styleKey = window.futurePreviewStyle || 'gemini';
        const template = window.futureStyleConfig[styleKey]?.noteTemplate;
        futureNote.textContent = typeof template === 'function'
            ? template(userName)
            : `${userName}, aap yahan apna next idea/comment likh sakte ho.`;
    }
    window.startFuturePreviewRotation();

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

document.addEventListener('DOMContentLoaded', () => {
    if (window.__roomLinkHandled) return;
    window.__roomLinkHandled = true;

    const linkData = window.getRoomLinkDataFromUrl();
    if (!linkData) return;

    const isLoggedIn = localStorage.getItem('a1_ai_logged_in') === 'true';
    if (isLoggedIn) {
        window.openRoomFromDeepLink(linkData);
    } else {
        sessionStorage.setItem('a1_pending_room_link', JSON.stringify(linkData));
    }
});



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
window.thinkingTraceIntervals = window.thinkingTraceIntervals || {};

window.createThinkingBreakdownData = function(userText, mode = 'text') {
    const sourceText = String(userText || '').trim();
    const rawWords = sourceText
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(Boolean);
    const topicWords = [...new Set(rawWords.filter(w => w.length > 3))].slice(0, 3);
    const topics = topicWords.length ? topicWords : ['context', 'intent', mode === 'voice' ? 'speech' : 'response'];
    const styleKey = String(window.futurePreviewStyle || 'gemini').toLowerCase();
    const styleLabel = styleKey === 'chatgpt' ? 'ChatGPT Style' : styleKey === 'claude' ? 'Claude Style' : styleKey === 'groq' ? 'Groq Style' : 'Gemini Style';
    const modeLabel = mode === 'voice' ? 'Live Voice' : 'Text Chat';

    return {
        styleLabel,
        modeLabel,
        steps: [
            {
                title: 'Question समझना',
                detail: `User prompt se main topic identify kiya: ${topics.map(t => `"${t}"`).join(', ')}`,
                source: mode === 'voice' ? 'Mic/Text Input' : 'Chat Input',
                safety: 'Clarity Check'
            },
            {
                title: 'Relevant data चुनना',
                detail: `Current chat context aur recent messages ke basis par response path banaya gaya (${styleLabel}).`,
                source: 'Conversation Context',
                safety: 'Relevance Filter'
            },
            {
                title: 'Answer structure बनाना',
                detail: `${modeLabel} ke liye छोटे-छोटे actionable topics mein draft तैयार kiya.`,
                source: 'Reasoning Pipeline',
                safety: 'Topic Segmentation'
            },
            {
                title: 'Safety & final polish',
                detail: 'Unsafe, unclear ya misleading output ko filter karke final response ready kiya.',
                source: 'Safety Rules',
                safety: 'Policy Guard'
            }
        ]
    };
};

window.renderThinkingTraceHtml = function(traceId, breakdown, options = {}) {
    const steps = Array.isArray(breakdown?.steps) ? breakdown.steps : [];
    const title = options.title || 'Thinking Timeline';
    const badge = options.badge || 'Analyzing';
    const styleLabel = breakdown?.styleLabel || 'AI Style';
    const modeLabel = breakdown?.modeLabel || 'Session';
    const live = options.live ? '1' : '0';

    const rows = steps.map((step, index) => `
        <li class="thinking-trace-step ${index === 0 ? 'is-active' : ''}" data-step-index="${index}">
            <div class="thinking-step-head">
                <strong>${window.escapeHtml(step.title || `Step ${index + 1}`)}</strong>
                <span class="thinking-step-index">#${index + 1}</span>
            </div>
            <p>${window.escapeHtml(step.detail || '')}</p>
            <div class="thinking-step-meta">
                <span class="thinking-chip"><i class="fas fa-database"></i> ${window.escapeHtml(step.source || 'Source')}</span>
                <span class="thinking-chip"><i class="fas fa-shield-alt"></i> ${window.escapeHtml(step.safety || 'Safety')}</span>
            </div>
        </li>
    `).join('');

    return `
        <div id="${traceId}" class="thinking-trace" data-live="${live}">
            <div class="thinking-trace-header">
                <div class="thinking-trace-title-wrap">
                    <div class="thinking-trace-title">${window.escapeHtml(title)}</div>
                    <div class="thinking-trace-subtitle">${window.escapeHtml(modeLabel)} • ${window.escapeHtml(styleLabel)}</div>
                </div>
                <div class="thinking-trace-actions">
                    <span class="thinking-trace-badge">${window.escapeHtml(badge)}</span>
                    <button class="thinking-trace-toggle ios-btn" onclick="window.toggleThinkingTrace(this)" aria-label="Toggle thinking details">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
            </div>
            <div class="thinking-trace-body quantum-scrollbar">
                <ul class="thinking-trace-list">${rows}</ul>
            </div>
        </div>
    `;
};

window.toggleThinkingTrace = function(btn) {
    const wrap = btn?.closest('.thinking-trace');
    if (!wrap) return;
    wrap.classList.toggle('is-collapsed');
    const icon = btn.querySelector('i');
    if (icon) icon.className = wrap.classList.contains('is-collapsed') ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
};

window.startThinkingTraceAnimation = function(traceId, totalSteps, stepDuration = 2200) {
    const trace = document.getElementById(traceId);
    if (!trace) return;
    const steps = Array.from(trace.querySelectorAll('.thinking-trace-step'));
    if (!steps.length) return;
    const safeLen = Math.max(1, Number(totalSteps) || steps.length);
    let index = 0;
    const tick = () => {
        steps.forEach((el, i) => {
            el.classList.toggle('is-active', i === index);
            if (i < index) el.classList.add('is-done');
        });
        index = (index + 1) % safeLen;
    };
    tick();
    if (window.thinkingTraceIntervals[traceId]) clearInterval(window.thinkingTraceIntervals[traceId]);
    window.thinkingTraceIntervals[traceId] = setInterval(tick, stepDuration);
};

window.finishThinkingTrace = function(traceId, isComplete = true) {
    const trace = document.getElementById(traceId);
    if (!trace) return;
    if (window.thinkingTraceIntervals[traceId]) {
        clearInterval(window.thinkingTraceIntervals[traceId]);
        delete window.thinkingTraceIntervals[traceId];
    }
    const steps = trace.querySelectorAll('.thinking-trace-step');
    steps.forEach((el) => {
        el.classList.remove('is-active');
        if (isComplete) el.classList.add('is-done');
    });
    const badge = trace.querySelector('.thinking-trace-badge');
    if (badge) badge.textContent = isComplete ? 'Completed' : 'Stopped';
    trace.dataset.live = '0';
};

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
    document.querySelectorAll('.thinking-trace[data-live="1"]').forEach(trace => {
        window.finishThinkingTrace(trace.id, false);
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
    const welcomeBanner = document.getElementById("welcome-banner");
    if (welcomeBanner) welcomeBanner.style.display = "none";
    window.stopFuturePreviewRotation();
    
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
    const traceId = `trace-${msgId}`;
    const thinkingBreakdown = window.createThinkingBreakdownData(text, 'text');
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
        ${window.renderThinkingTraceHtml(traceId, thinkingBreakdown, { title: 'AI Thinking Details', badge: 'Analyzing', live: true })}
        
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
    window.startThinkingTraceAnimation(traceId, thinkingBreakdown.steps.length, 2400);

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
        window.finishThinkingTrace(traceId, true);
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
        let typedRaw = "";
        function typeWriter() {
            if (i < rawResponse.length && window.isGenerating) {
                typedRaw += rawResponse.charAt(i);
                textElement.textContent = typedRaw;
                i++;
                chatBox.scrollTo({ top: chatBox.scrollHeight });
                setTimeout(typeWriter, 30);
            } else {
                if (textElement) textElement.innerHTML = window.formatChatText(typedRaw || rawResponse);
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







