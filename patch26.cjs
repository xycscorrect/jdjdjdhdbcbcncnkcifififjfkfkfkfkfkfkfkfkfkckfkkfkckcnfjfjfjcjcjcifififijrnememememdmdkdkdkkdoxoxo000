const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const asyncBotCall = `    setTimeout(async () => {
        const bMap = { 'bot-gx': 'Game Bot (Gx)', 'bot-ide': 'IDE Bot', 'bot-code': 'Code Bot', 'bot-otak': 'Bot Teks' };
        
        let apiKey;
        let systemPrompt = "SYSTEM: You are a helpful bot named " + (bMap[currentBot]||"Bot");
        if(currentBot === 'bot-gx') apiKey = API_KEYS.botGx;
        else if(currentBot === 'bot-ide') apiKey = API_KEYS.botIde;
        else if(currentBot === 'bot-code') apiKey = API_KEYS.botCode;
        else if(currentBot === 'bot-otak') apiKey = API_KEYS.botTeks;
        else if(currentBot === 'bot-detect') apiKey = API_KEYS.detector;
        else apiKey = API_KEYS.aiPro;

        try {
            let userPrompt = text;
            if(usedImg) userPrompt = "[Image Attachment in Context - Assume they sent an image]\\n" + text;
            let finalPrompt = systemPrompt + "\\n\\nUSER: " + userPrompt;
            let reply = await callGeneralAI(finalPrompt, apiKey);
            botChats[currentBot].push({
                id: generateId(), sender: currentBot, isBot: true,
                text: reply, ts: Date.now()
            });
        } catch(e) {
            botChats[currentBot].push({
                id: generateId(), sender: currentBot, isBot: true,
                text: "Error internal API AI: " + e.message, ts: Date.now()
            });
        }
        renderBotChat();
    }, 500);`;

const origBotTimeout = `    setTimeout(() => {
        const bMap = { 'bot-gx': 'Game Bot (Gx)', 'bot-ide': 'IDE Bot', 'bot-code': 'Code Bot', 'bot-otak': 'Bot Teks' };
        botChats[currentBot].push({
            id: generateId(), sender: currentBot, isBot: true,
            img: usedImg, text: \`Halo \${currentUser.username}! Saya adalah **\${bMap[currentBot] || 'Bot AI'}**.\n\nIni adalah respon simulasi markdown yang **lengkap dan detail**. Jika disambungkan ke Gemini atau model AI lainnya, saya akan bisa:\n- 🚀 Menjawab pertanyaan kompleks secara runut\n- 📝 Menulis, mengoreksi, serta me-refactor kode\n- 🛠️ Debugging script dan teks (Correct CS)\n\n\`\`\`javascript\n// Inisialisasi engine \${bMap[currentBot]}\nconst ai = await loadXyCsEngine("\${currentBot}");\nai.start();\n\`\`\`\`,
            ts: Date.now()
        });
        renderBotChat();
    }, 1000);`;

html = html.replace(origBotTimeout, asyncBotCall);

fs.writeFileSync('index.html', html);
console.log('Replaced timeout with async bot chat');
