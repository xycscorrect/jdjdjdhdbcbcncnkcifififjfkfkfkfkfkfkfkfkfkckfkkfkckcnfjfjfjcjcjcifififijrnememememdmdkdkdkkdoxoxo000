const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Add getBotSessionKey
if (!content.includes('function getBotSessionKey')) {
    content = content.replace(
        /let activeBotSessionId = null;/,
        `function getBotSessionKey() { return (currentUser ? currentUser.username : 'GUEST') + '_' + currentBot; }\nlet activeBotSessionId = null;`
    );
}

const lines = content.split('\n');
const out = [];
for(let i=0; i<lines.length; i++) {
    let line = lines[i];
    if(i >= 1060 && i <= 1350) {
        if(line.includes('botSessions[currentBot]')) {
            line = line.replace(/botSessions\[currentBot\]/g, "botSessions[getBotSessionKey()]");
        }
        if(line.includes('botChats[currentBot]')) {
             line = line.replace(/botChats\[currentBot\]/g, "botChats[getBotSessionKey()]");
        }
    }
    out.push(line);
}
fs.writeFileSync('index.html', out.join('\n'));
