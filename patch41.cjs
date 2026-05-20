const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const wipeOldFakeMessages = `
    // Wipe old fake AI messages from local storage silently on first load
    ['bot-gx', 'bot-ide', 'bot-code', 'bot-otak', 'bot-detect'].forEach(b => {
        if(botSessions[b]) {
            botSessions[b].forEach(s => {
                s.messages = s.messages.filter(m => !m.text.includes('Ini adalah respon simulasi markdown yang **lengkap dan detail**'));
            });
        }
    });
    DB.set('botSessions', botSessions);
`;

html = html.replace('function initApp() {', 'function initApp() {\n' + wipeOldFakeMessages);

fs.writeFileSync('index.html', html);
console.log("Applied silent wiper for old fake messages");
