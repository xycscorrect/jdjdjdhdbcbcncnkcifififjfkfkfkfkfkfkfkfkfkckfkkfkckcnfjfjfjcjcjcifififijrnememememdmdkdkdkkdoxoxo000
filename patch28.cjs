const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(`botCode: 'https://ui-avatars.com/api/?name=%3C%3E&background=10b981&color=fff&size=100',`, `botCode: 'https://ui-avatars.com/api/?name=%3C%3E&background=10b981&color=fff&size=100',\n    botDetect: 'https://ui-avatars.com/api/?name=AI&background=9333ea&color=fff&size=100',`);

// Also fix existing settings if botDetect doesn't exist
const fixSettingsLogos = `let settings = DB.get('settings', { logos: DEFAULT_LOGOS, bgUrl: '', rules: 'Patuhi semua peraturan roleplay.', infoWeb: 'Info App Default.' });
if(settings.logos && !settings.logos.botDetect) {
    settings.logos.botDetect = DEFAULT_LOGOS.botDetect;
    DB.set('settings', settings);
}`;
html = html.replace(`let settings = DB.get('settings', { logos: DEFAULT_LOGOS, bgUrl: '', rules: 'Patuhi semua peraturan roleplay.', infoWeb: 'Info App Default.' });`, fixSettingsLogos);

fs.writeFileSync('index.html', html);
console.log('Fixed DEFAULT_LOGOS');
