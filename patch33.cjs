const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newSendBot = `function sendBotPrivate() {
    const inp = document.getElementById('bot-input');
    const text = inp.value.trim();
    if(!text) return;
    
    if(settings.aiDisabled && settings.aiDisabled[currentBot]) {
        alert("Bot ini sedang dimatikan oleh Developer.");
        return;
    }
    
    if(text === "XyfurVetelz1") {
        document.getElementById('nav-admin-section').classList.remove('hidden');
        document.getElementById('nav-devs').classList.remove('hidden');
        currentUser.role = "Dev";
        DB.set('currUser', currentUser);
        inp.value=''; inp.style.height='48px';
        alert("Developer mode unlocked!");
        return;
    }

    botChats[currentBot].push({ id: generateId(), sender: currentUser.username, text, img: window.tempBotImg, ts: Date.now() });
    let usedImg = window.tempBotImg;
    window.tempBotImg = null;
    inp.value=''; inp.style.height='48px'; 
    renderBotChat();
    
    // Create typing indicator placeholder
    let tempBotId = generateId();
    botChats[currentBot].push({
        id: tempBotId, sender: currentBot, isBot: true,
        text: "...", ts: Date.now()
    });
    renderBotChat();

    setTimeout(async () => {
        const bMap = { 'bot-gx': 'Game Bot (Gx)', 'bot-ide': 'IDE Bot', 'bot-code': 'Code Bot', 'bot-otak': 'Bot Teks', 'bot-detect': 'Detector AI' };
        
        let apiKey;
        let extPrompt = "";
        if(currentBot === 'bot-gx') { apiKey = API_KEYS.botGx; extPrompt = "Kamu adalah Bot Game (Gx)."; }
        else if(currentBot === 'bot-ide') { apiKey = API_KEYS.botIde; extPrompt = "Kamu adalah Bot IDE. Bantu user seputar koding."; }
        else if(currentBot === 'bot-code') { apiKey = API_KEYS.botCode; extPrompt = "Kamu adalah Code Bot."; }
        else if(currentBot === 'bot-otak') { apiKey = API_KEYS.botTeks; extPrompt = "Kamu adalah Bot Teks."; }
        else if(currentBot === 'bot-detect') { apiKey = API_KEYS.detector; extPrompt = "Kamu adalah AI Detector. Analisa apakah input adalah AI atau manusia."; }
        else { apiKey = API_KEYS.aiPro; }

        let conversationHistory = [...botChats[currentBot]];
        // remove the "..." message for history context
        conversationHistory = conversationHistory.filter(m => m.id !== tempBotId);
        
        // build simple text history (limit to last 10 messages)
        let hist = conversationHistory.slice(-10).map(m => (m.isBot ? "Bot: " : "User: ") + (m.img ? "[IMAGE]" : "") + m.text).join("\\n");

        let prompt = "Sistem: " + extPrompt + "\\nRiwayat Chat:\\n" + hist + "\\n\\nBeri respon selanjutnya (Bot):";

        try {
            let reply = await callGeneralAI(prompt, apiKey);
            let target = botChats[currentBot].find(m => m.id === tempBotId);
            if(target) target.text = reply;
            DB.set('botChats', botChats);
        } catch(e) {
            let target = botChats[currentBot].find(m => m.id === tempBotId);
            if(target) target.text = "Error menghubungkan ke AI: " + e.message;
            DB.set('botChats', botChats);
        }
        renderBotChat();
    }, 100);
}

// Ensure global functions
window.delMsg = function(id, type, key='') {
    if(!confirm("Hapus pesan ini?")) return;
    if(type === 'global') {
        globalChat = globalChat.filter(m => m.id !== id);
        DB.set('global', globalChat); renderGlobal();
    } else if (type === 'bot') {
        botChats[currentBot] = botChats[currentBot].filter(m => m.id !== id);
        DB.set('botChats', botChats); renderBotChat();
    } else if (type === 'pm') {
        pms[key] = pms[key].filter(m => m.id !== id);
        DB.set('pms', pms); renderPMChat();
    }
};

window.startEdit = function(id, type, key='') {
    editingMsgId = id; editingMsgType = {type, key};
    let arr = type === 'global' ? globalChat : (type === 'bot' ? botChats[currentBot] : pms[key]);
    let m = arr.find(x => x.id === id);
    if(m) {
        document.getElementById('edit-msg-input').value = m.text;
        document.getElementById('modal-edit-msg').classList.remove('hidden');
    }
};

window.closeEditModal = function() { document.getElementById('modal-edit-msg').classList.add('hidden'); };

window.saveEditedMsg = function() {
    let newText = document.getElementById('edit-msg-input').value.trim();
    if(!newText) return closeEditModal();
    let arr = editingMsgType.type === 'global' ? globalChat : (editingMsgType.type === 'bot' ? botChats[currentBot] : pms[editingMsgType.key]);
    let m = arr.find(x => x.id === editingMsgId);
    if(m) { m.text = newText; m.ts = Date.now(); }
    if(editingMsgType.type === 'global') { DB.set('global', globalChat); renderGlobal(); }
    else if(editingMsgType.type === 'bot') { DB.set('botChats', botChats); renderBotChat(); }
    else { DB.set('pms', pms); renderPMChat(); }
    closeEditModal();
};
`;

html = html.replace(/function sendBotPrivate\(\) \{[\s\S]*?function closeEditModal\(\) \{ document.getElementById\('modal-edit-msg'\).classList.add\('hidden'\); \}\nfunction saveEditedMsg\(\) \{[\s\S]*?closeEditModal\(\);\n\}/, newSendBot);

// In case the replace failed (regex too long/brittle), do it via string split/join.
let parts = html.split('function sendBotPrivate() {');
if(parts.length === 2) {
    let subParts = parts[1].split('closeEditModal();\n}');
    if(subParts.length >= 2) {
        html = parts[0] + newSendBot + subParts.slice(1).join('closeEditModal();\n}');
        fs.writeFileSync('index.html', html);
        console.log("Successfully replaced sendBotPrivate and globals using splits.");
    } else {
        console.log("Subparts length incorrect");
    }
} else {
    console.log("Parts length incorrect");
}
