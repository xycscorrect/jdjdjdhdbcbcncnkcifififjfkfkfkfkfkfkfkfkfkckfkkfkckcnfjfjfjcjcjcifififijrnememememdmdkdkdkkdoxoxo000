const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The feature will need:
// 1. global variable for sessions
// 2. migrating old botChats to botSessions if botSessions doesn't exist.
// 3. Modifying renderBotChat to use botSessions[currentBot].find(s => s.id === currentSessionId).messages
// 4. Modifying sendBotPrivate to push to that list.
// 5. Creating a "Riwayat" modal to switch sessions / create new.

const backendStr = `
let botSessions = DB.get('botSessions', {});

// Migration & Intialization
function ensureBotSession() {
    if(!botSessions[currentBot]) botSessions[currentBot] = [];
    
    // Migrate old flat botChats
    if(botChats[currentBot] && botChats[currentBot].length > 0) {
        botSessions[currentBot].push({
            id: 'sess_' + Date.now(),
            title: 'Riwayat Lama',
            ts: Date.now(),
            messages: [...botChats[currentBot]]
        });
        botChats[currentBot] = []; // clear old so we don't migrate again
        DB.set('botChats', botChats);
    }
    
    if(botSessions[currentBot].length === 0) {
        botSessions[currentBot].push({
            id: 'sess_' + Date.now(),
            title: 'Chat Baru',
            ts: Date.now(),
            messages: []
        });
    }
    DB.set('botSessions', botSessions);
}

let activeBotSessionId = null;

window.newBotChat = function() {
    ensureBotSession();
    let nid = 'sess_' + Date.now();
    botSessions[currentBot].push({
        id: nid,
        title: 'Chat Baru ' + new Date().toLocaleTimeString(),
        ts: Date.now(),
        messages: []
    });
    DB.set('botSessions', botSessions);
    activeBotSessionId = nid;
    renderBotChat();
}

window.openBotSessionsModal = function() {
    ensureBotSession();
    let list = botSessions[currentBot].sort((a,b) => b.ts - a.ts);
    let html = list.map(s => \`
        <div class="flex items-center justify-between bg-gray-900 border border-gray-700 p-3 rounded-lg mb-2">
            <div class="flex-1 cursor-pointer" onclick="switchBotSession('\${s.id}')">
                <div class="font-bold text-white \${s.id === activeBotSessionId ? 'text-sky-400' : ''}">\${s.title}</div>
                <div class="text-xs text-gray-500">\${new Date(s.ts).toLocaleString()} • \${s.messages.length} msg</div>
            </div>
            <button class="text-red-400 p-2 hover:bg-gray-800 rounded" onclick="deleteBotSession('\${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
    \`).join('');
    
    document.getElementById('bot-history-list').innerHTML = html;
    document.getElementById('modal-bot-history').classList.remove('hidden');
}

window.closeBotSessionsModal = function() {
    document.getElementById('modal-bot-history').classList.add('hidden');
}

window.switchBotSession = function(id) {
    activeBotSessionId = id;
    renderBotChat();
    closeBotSessionsModal();
}

window.deleteBotSession = function(id) {
    if(!confirm("Hapus riwayat chat ini?")) return;
    botSessions[currentBot] = botSessions[currentBot].filter(s => s.id !== id);
    if(botSessions[currentBot].length === 0) newBotChat(); // ensure 1 exists
    else if (activeBotSessionId === id) activeBotSessionId = botSessions[currentBot][0].id;
    DB.set('botSessions', botSessions);
    openBotSessionsModal(); // re-render
    renderBotChat();
}

// Rewriting renderBotChat to use session
function renderBotChat() {
    ensureBotSession();
    if(!activeBotSessionId || !botSessions[currentBot].find(s=>s.id === activeBotSessionId)) {
        activeBotSessionId = botSessions[currentBot][0].id; // Fallback to first
    }
    
    let sess = botSessions[currentBot].find(s => s.id === activeBotSessionId);
    let msgs = sess ? sess.messages : [];
    
    const c = document.getElementById('bot-msg-container');
    let bc = [...msgs].sort((a,b) => (b.bookmarked?1:0) - (a.bookmarked?1:0));
    c.innerHTML = bc.map(m => renderHtmlMsg(m, 'bot')).join('');
    c.scrollTop = c.scrollHeight;
    
    // Auto title update if unnamed
    if(msgs.length > 0 && sess.title.startsWith('Chat Baru ')) {
        // Find first user message
        let firstUser = msgs.find(m => !m.isBot);
        if(firstUser) sess.title = firstUser.text.substring(0, 30) + '...';
        DB.set('botSessions', botSessions);
    }
}
`;

// Insert the code
html = html.replace("function renderBotChat() {", backendStr + "\n// old function overwritten below\nfunction dummy() {");

// Now we need to modify 'botChats[currentBot]' references inside sendBotPrivate and the globals.
const sendBotPatch1 = `    let sess = botSessions[currentBot].find(s => s.id === activeBotSessionId);
    sess.messages.push({ id: generateId(), sender: currentUser.username, text, img: window.tempBotImg, ts: Date.now() });
    sess.ts = Date.now();
    DB.set('botSessions', botSessions);`;
html = html.replace(`botChats[currentBot].push({ id: generateId(), sender: currentUser.username, text, img: window.tempBotImg, ts: Date.now() });`, sendBotPatch1);

const sendBotPatch2 = `    let sess2 = botSessions[currentBot].find(s => s.id === activeBotSessionId);
    let tempBotId = generateId();
    sess2.messages.push({
        id: tempBotId, sender: currentBot, isBot: true,
        text: "...", ts: Date.now()
    });
    DB.set('botSessions', botSessions);`;
html = html.replace(`    let tempBotId = generateId();
    botChats[currentBot].push({
        id: tempBotId, sender: currentBot, isBot: true,
        text: "...", ts: Date.now()
    });`, sendBotPatch2);

const sendBotPatch3 = `
        let sess3 = botSessions[currentBot].find(s => s.id === activeBotSessionId);
        let conversationHistory = [...sess3.messages];
        // remove the "..." message for history context
        conversationHistory = conversationHistory.filter(m => m.id !== tempBotId);
        
        // build simple text history (limit to last 10 messages)
        let hist = conversationHistory.slice(-10).map(m => (m.isBot ? "Bot: " : "User: ") + (m.img ? "[IMAGE]" : "") + m.text).join("\\n");

        let prompt = "Sistem: " + extPrompt + "\\nRiwayat Chat:\\n" + hist + "\\n\\nBeri respon selanjutnya (Bot):";

        try {
            let reply = await callGeneralAI(prompt, apiKey);
            let target = sess3.messages.find(m => m.id === tempBotId);
            if(target) target.text = reply;
            sess3.ts = Date.now();
            DB.set('botSessions', botSessions);
        } catch(e) {
            let target = sess3.messages.find(m => m.id === tempBotId);
            if(target) target.text = "Error menghubungkan ke AI: " + e.message;
            DB.set('botSessions', botSessions);
        }
        renderBotChat();`;

html = html.replace(/        let conversationHistory = \[\.\.\.botChats\[currentBot\]\];[\s\S]*?DB.set\('botChats', botChats\);\n        \}\n        renderBotChat\(\);/, sendBotPatch3);


// Globals edit msg replacements
const bookmarkPatch = `        let items = type === 'global' ? globalChat : (type === 'bot' ? botSessions[currentBot].find(s=>s.id===activeBotSessionId).messages : pms[key]);`;
html = html.replace(`        let items = type === 'global' ? globalChat : (type === 'bot' ? botChats[currentBot] : pms[key]);`, bookmarkPatch);

const delMsgPatch = `    } else if (type === 'bot') {
        let sess = botSessions[currentBot].find(s=>s.id===activeBotSessionId);
        sess.messages = sess.messages.filter(m => m.id !== id);
        DB.set('botSessions', botSessions); renderBotChat();`;
html = html.replace(`    } else if (type === 'bot') {
        botChats[currentBot] = botChats[currentBot].filter(m => m.id !== id);
        DB.set('botChats', botChats); renderBotChat();`, delMsgPatch);

const startEditPatch = `    let arr = type === 'global' ? globalChat : (type === 'bot' ? botSessions[currentBot].find(s=>s.id===activeBotSessionId).messages : pms[key]);`;
html = html.replace(`    let arr = type === 'global' ? globalChat : (type === 'bot' ? botChats[currentBot] : pms[key]);`, startEditPatch);

const saveEditPatch = `    let arr = editingMsgType.type === 'global' ? globalChat : (editingMsgType.type === 'bot' ? botSessions[currentBot].find(s=>s.id===activeBotSessionId).messages : pms[editingMsgType.key]);`;
html = html.replace(`    let arr = editingMsgType.type === 'global' ? globalChat : (editingMsgType.type === 'bot' ? botChats[currentBot] : pms[editingMsgType.key]);`, saveEditPatch);

const dbSetBotChatsPatch = `    else if(editingMsgType.type === 'bot') { DB.set('botSessions', botSessions); renderBotChat(); }`;
html = html.replace(`    else if(editingMsgType.type === 'bot') { DB.set('botChats', botChats); renderBotChat(); }`, dbSetBotChatsPatch);

// Modal HTML injection
const modalHistoryHtml = `<!-- Bot History Modal -->
<div id="modal-bot-history" class="hidden fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
    <div class="bg-gray-800 rounded-xl p-5 w-full max-w-md border border-gray-600 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg text-white"><i class="fas fa-history text-sky-400"></i> Riwayat Chat</h3>
            <button class="text-gray-400 hover:text-white" onclick="closeBotSessionsModal()"><i class="fas fa-times"></i></button>
        </div>
        <button onclick="newBotChat(); closeBotSessionsModal()" class="w-full bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-lg mb-4 font-bold flex items-center justify-center gap-2"><i class="fas fa-plus"></i> Chat Baru</button>
        <div id="bot-history-list" class="flex-1 overflow-y-auto custom-scroll pr-2"></div>
    </div>
</div>
</body>`;
html = html.replace('</body>', modalHistoryHtml);

fs.writeFileSync('index.html', html);
console.log('Added Bot Chat History properly');
