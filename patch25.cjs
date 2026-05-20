const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// CS Sub Text
html = html.replace("let reply = await callAI(prompt);", "let reply = await callGeneralAI(prompt, API_KEYS.correctCS);");
// AI Detector
html = html.replace('let reply = await callAI("Apakah', 'let reply = await callGeneralAI("Apakah');
html = html.replace('reply = await callGeneralAI("Apakah', 'reply = await callGeneralAI("Apakah teks berikut dibuat oleh AI atau manusia? Beri analisis singkat (maks 2 kalimat): \\n" + text, API_KEYS.botAiDetect); //');
// AI Pro Bot
html = html.replace('let reply = await callAI("SYSTEM: Expert Developer. Jawab detail, cerdas, tidak berbasa-basi.\\n\\n" + text);', 'let reply = await callGeneralAI("SYSTEM: Expert Developer. Jawab detail, cerdas, tidak berbasa-basi.\\n\\n" + text, API_KEYS.aiPro);');

fs.writeFileSync('index.html', html);
console.log('Replaced callAI occurrences');
