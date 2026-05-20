const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add to LOGO_FIELDS
html = html.replace("botOtak: 'Text Detect'", "botOtak: 'Text Detect', botDetect: 'Detector AI'");

// Add to bot map
html = html.replace("bot-otak': 'Bot Teks' };", "bot-otak': 'Bot Teks', 'bot-detect': 'Detector AI' };");

// Add button to sidebar
const newBotHtml = `<button onclick="nav('bot-detect')" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-700 transition nav-item" id="nav-bot-detect">
                    <img class="logo-bot-detect circle-logo w-6 h-6 border border-gray-600"> Detector AI
                </button>`;
html = html.replace(`                <button onclick="nav('bot-otak')" class="w-full`, newBotHtml + `\n                <button onclick="nav('bot-otak')" class="w-full`);

// Add to applyLogos
const addApply = `    document.querySelectorAll('.logo-bot-otak').forEach(e => e.src = settings.logos.botOtak);\n    document.querySelectorAll('.logo-bot-detect').forEach(e => e.src = settings.logos.botDetect);`;
html = html.replace(`document.querySelectorAll('.logo-bot-otak').forEach(e => e.src = settings.logos.botOtak);`, addApply);

// Navigation switch
const addNav = `        if(to === 'bot-otak') hdrLogoSrc = settings.logos.botOtak;\n        if(to === 'bot-detect') hdrLogoSrc = settings.logos.botDetect;`;
html = html.replace(`        if(to === 'bot-otak') hdrLogoSrc = settings.logos.botOtak;`, addNav);

fs.writeFileSync('index.html', html);
console.log('Added Bot Detect panel');
