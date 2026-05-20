const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const botMentionOld = `        // Bot Tag Detection
        if(text.includes('@BotXyCs')) {
            setTimeout(() => {
                globalChat.push({
                    id: generateId(), sender: 'BotXyCs', isBot: true,
                    text: \`Halo @\${currentUser.username}, Anda mensummon saya! *(Catatan: Tambahkan Integrasi API Gemini Anda di dalam code untuk respon AI asli)*\`,
                    ts: Date.now()
                });
                DB.set('global', globalChat);
                renderGlobal();
            }, 1000);
        }`;

const botMentionNew = `        // Bot Tag Detection
        if(text.includes('@BotXyCs')) {
            // Placeholder loading message
            let botMsgId = generateId();
            globalChat.push({ id: botMsgId, sender: 'BotXyCs', isBot: true, text: "Memproses...", ts: Date.now() });
            renderGlobal();
            
            setTimeout(async () => {
                 try {
                     let prompt = "Sistem: Kamu adalah BotXyCs di chat global. Jawab pertanyaan berikut dari user " + currentUser.username + " secara singkat dan jelas.\\nUser: " + text;
                     let reply = await callGeneralAI(prompt, API_KEYS.botXyCs);
                     let target = globalChat.find(m => m.id === botMsgId);
                     if(target) target.text = reply;
                 } catch(e) {
                     let target = globalChat.find(m => m.id === botMsgId);
                     if(target) target.text = "Error BotXyCs: " + e.message;
                 }
                 DB.set('global', globalChat);
                 renderGlobal();
            }, 100);
        }`;

html = html.replace(botMentionOld, botMentionNew);
fs.writeFileSync('index.html', html);
console.log("Applied BotXyCs real integration patch");
