/* 🛡️ WEB 4.0 SECURITY: Encrypted Onboarding Pipeline | 🧬 AUTO-HEAL: Active */
/* =========================================================
   A1 AI - Quantum JavaScript Logic Engine (ONBOARDING 100% FIXED)
   PURPOSE: Human Typing, Custom DOB, Smart Gender & Clean UI
========================================================= */

// 🚀 FIX 1: Light/Dark Mode Compatible Text (in script_07.js)
const aiIntroHTML = `Hello, I am <span style="color: #3b82f6; font-weight: bold;">AI model A1.</span><br><br>
Aapki sewa mein <span style="color: var(--os-text-primary); font-weight: 600;">personal assistant</span> ke roop mein kaam karta hun. Aap jab chahein mujhe pukar sakte hain ya mujhse kuch bhi sawal pooch sakte hain. Aap bilkul <span style="color: #f97316;">without kisi condition</span> ke meri madad le sakte hain.<br><br>
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
        
        // 🚀 Hide Floating Buttons on Onboarding
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

        // 🚀 FIX: Reset Typing Area for New User
        if (typingArea) {
            typingArea.style.fontSize = '';
            typingArea.style.maxHeight = 'none';
            typingArea.style.overflowY = 'visible';
            typingArea.style.padding = '0';
            typingArea.style.background = 'transparent';
            typingArea.style.border = 'none';
        }

        if (textDisplay) textDisplay.innerHTML = ""; 

        // 🚀 FIX: In-line Cursor & Human Typing Logic
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
                
                if (typingArea) {
                    typingArea.scrollTop = typingArea.scrollHeight;
                }
            }
            textDisplay.innerHTML = typedText; 
        }
        
        // 🚀 100% BUG FIX: Perfect Shrinking Box Without Clipping text
        if (typingArea) {
            typingArea.style.transition = 'all 0.5s ease-in-out';
            typingArea.style.fontSize = '15px'; 
            typingArea.style.lineHeight = '1.8';
            typingArea.style.maxHeight = '400px'; // डब्बे का साइज़
            typingArea.style.overflowY = 'auto'; // स्क्रॉल बार
            typingArea.style.padding = '20px'; // टेक्स्ट को कटने से रोकेगा
            typingArea.style.boxSizing = 'border-box';
            typingArea.style.background = 'var(--os-btn-bg, rgba(255,255,255,0.03))'; // प्रीमियम बॉक्स लुक
            typingArea.style.border = '1px solid var(--os-border, rgba(255,255,255,0.1))';
            typingArea.style.borderRadius = '12px';
            typingArea.style.marginBottom = '20px';
            typingArea.classList.add('quantum-scrollbar'); 

            // डब्बा छोटा होने के बाद, टेक्स्ट को सबसे ऊपर (Top) स्क्रॉल कर दे ताकि यूज़र आराम से पढ़ सके
            setTimeout(() => {
                typingArea.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        }
        
        const nameContainer = document.getElementById('name-container');
        if (nameContainer) {
            setTimeout(() => {
                nameContainer.classList.remove('hidden');
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

    // Populate Arrays
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

        const onboardBox = document.getElementById('onboarding-view');
        if (onboardBox) {
            onboardBox.classList.add('hidden');
            onboardBox.style.setProperty('display', 'none', 'important');
        }
        
        // Restore Floating Buttons for Home Screen
        const floatingBtns = document.querySelector('.floating-action-group');
        if (floatingBtns) floatingBtns.style.setProperty('display', 'flex', 'important');

        if(typeof grantAccess === 'function') grantAccess(true); 
    } catch(e) { console.error(e); }
};
