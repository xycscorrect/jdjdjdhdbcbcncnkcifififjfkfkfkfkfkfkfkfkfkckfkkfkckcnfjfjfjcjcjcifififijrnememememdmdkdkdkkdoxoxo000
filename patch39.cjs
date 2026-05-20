const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const mentionPopupHtml = `<div id="mention-popup" class="hidden fixed z-[9999] bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-y-auto max-h-48 min-w-[200px] flex flex-col"></div>\n</body>`;

if (!html.includes('id="mention-popup"')) {
    html = html.replace('</body>', mentionPopupHtml);
}

const mentionScript = `
/* ======================== 
     MENTION AUTOCOMPLETE
======================== */
let mentionTargetInput = null;
let mentionCurrentQuery = "";

function findMentionQuery(val, cursor) {
    let untilCursor = val.substring(0, cursor);
    let match = untilCursor.match(/@(\\w*)$/);
    if(match) return match[1];
    return null;
}

function handleInputForMention(e) {
    let input = e.target;
    let val = input.value;
    let cursor = input.selectionStart;
    let query = findMentionQuery(val, cursor);
    
    const popup = document.getElementById('mention-popup');
    
    if(query !== null) {
        let allNames = Object.keys(users);
        // Include default bots
        ["BotXyCs", "BotGx", "BotIDE", "BotCode", "BotTeks", "BotDetect", "BotAiPro"].forEach(b => {
             if(!allNames.includes(b)) allNames.push(b);
        });
        
        let filtered = allNames.filter(n => n.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
        if(filtered.length > 0) {
            mentionTargetInput = input;
            mentionCurrentQuery = query;
            
            let rect = input.getBoundingClientRect();
            popup.style.left = rect.left + 'px';
            popup.style.bottom = (window.innerHeight - rect.top + 5) + 'px'; // float above input
            
            popup.innerHTML = filtered.map(name => {
                let isBot = name.toLowerCase().includes('bot');
                let icon = isBot ? '🤖' : '👤';
                return \`<div class="mention-item p-2 hover:bg-sky-700 cursor-pointer text-sm text-white flex items-center gap-2 border-b border-gray-700/50" onclick="insertMention('\${name}')">\${icon} \${name}</div>\`;
            }).join('');
            
            popup.classList.remove('hidden');
        } else {
            popup.classList.add('hidden');
            mentionTargetInput = null;
        }
    } else {
        popup.classList.add('hidden');
        mentionTargetInput = null;
    }
}

window.insertMention = function(name) {
    if(!mentionTargetInput) return;
    let val = mentionTargetInput.value;
    let cursor = mentionTargetInput.selectionStart;
    
    // find index of @ before cursor
    let untilCursor = val.substring(0, cursor);
    let lastAt = untilCursor.lastIndexOf('@');
    
    let beforeAt = val.substring(0, lastAt);
    let afterCursor = val.substring(cursor);
    
    mentionTargetInput.value = beforeAt + '@' + name + ' ' + afterCursor;
    mentionTargetInput.focus();
    
    document.getElementById('mention-popup').classList.add('hidden');
    mentionTargetInput = null;
};

document.addEventListener('click', (e) => {
    if(!e.target.closest('#mention-popup') && !e.target.closest('textarea')) {
        document.getElementById('mention-popup').classList.add('hidden');
    }
});

`;

// We inject the script at the bottom
html = html.replace('// ======== Admin Settings ========', mentionScript + '\n// ======== Admin Settings ========');

// Add oninput hook to global-input and pm-input, and bot-input, and aipro-input
html = html.replace(/oninput="autoExpand\(this\)"/g, `oninput="autoExpand(this); handleInputForMention(event)"`);
html = html.replace(/oninput="autoExpand\(this\); handleInputForMention\(event\); handleInputForMention\(event\)"/g, `oninput="autoExpand(this); handleInputForMention(event)"`);

// Check if aipro has it: 
html = html.replace('id="aipro-input" class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 custom-scroll resize-none max-h-32 min-h-[48px]" placeholder="Ask AI Pro (Coding, Brainstorm, dll)..." oninput="autoExpand(this)"', 'id="aipro-input" class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 custom-scroll resize-none max-h-32 min-h-[48px]" placeholder="Ask AI Pro (Coding, Brainstorm, dll)..." oninput="autoExpand(this); handleInputForMention(event)"');

fs.writeFileSync('index.html', html);
console.log("Applied Mentions Autocomplete");
