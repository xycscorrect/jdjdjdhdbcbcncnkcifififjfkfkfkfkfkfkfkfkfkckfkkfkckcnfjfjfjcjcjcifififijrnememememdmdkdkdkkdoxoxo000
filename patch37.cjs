const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Mobile action buttons visibility
html = html.replace('opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 flex gap-1 bg-gray-800 p-1 rounded shadow', 'opacity-100 md:opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 flex gap-1 bg-gray-800 p-1 rounded shadow');

// 2. /clear command in Global Chat
const sendMsgLogicOld = `    if(type === 'global') {
        globalChat.push(msg);
        DB.set('global', globalChat);
        input.value = ''; input.style.height = '48px';
        renderGlobal();`;

const sendMsgLogicNew = `    if(type === 'global') {
        if(text === '/clear' && (currentUser.role.toLowerCase().includes('admin') || currentUser.role.toLowerCase().includes('dev'))) {
            globalChat = [];
            DB.set('global', globalChat);
            input.value = ''; input.style.height = '48px';
            renderGlobal();
            return;
        }
        globalChat.push(msg);
        DB.set('global', globalChat);
        input.value = ''; input.style.height = '48px';
        renderGlobal();`;

html = html.replace(sendMsgLogicOld, sendMsgLogicNew);

// 3. Dev only "User & Logs"
const devOnlyStr = `    let roleLower = currentUser.role.toLowerCase();
    
    // Admin section logic (Role Mgmt, etc.)
    if(roleLower.includes('admin') || roleLower.includes('dev')) {
        document.getElementById('nav-admin-section').classList.remove('hidden');
        document.getElementById('nav-admin-roles').classList.remove('hidden'); // allow admin
    } else {
        document.getElementById('nav-admin-section').classList.add('hidden');
    }
    
    // User & Logs -> ONLY Dev
    if(roleLower.includes('dev')) {
        document.getElementById('nav-admin-logs').classList.remove('hidden');
        document.getElementById('nav-devs').classList.remove('hidden');
    } else {
        let logsLink = document.getElementById('nav-admin-logs');
        if(logsLink) logsLink.classList.add('hidden');
        let devsLink = document.getElementById('nav-devs');
        if(devsLink) devsLink.classList.add('hidden');
    }`;

html = html.replace(/    let roleLower = currentUser\.role\.toLowerCase\(\);\n    if\(roleLower\.includes\('admin'\) \|\| roleLower\.includes\('dev'\)\) \{\n        document\.getElementById\('nav-admin-section'\)\.classList\.remove\('hidden'\);\n    \}/, devOnlyStr);


// 4. Bio URLs (regex fixing)
const processLinksOld = `    // Process links in desc
    let desc = viewProfUser.desc || '-';
    let formattedDesc = desc.replace(/(https?:\\/\\/[^\\s]+)/g, '<a href="$1" target="_blank" class="text-blue-400 hover:underline hover:text-blue-300">$1</a>');
    formattedDesc = formattedDesc.replace(/(www\\.[^\\s]+)/g, '<a href="http://$1" target="_blank" class="text-blue-400 hover:underline hover:text-blue-300">$1</a>');
    let ioMatches = formattedDesc.match(/([a-zA-Z0-9.-]+\\.(com|net|io|org|id|my|xyz))/g);
    if(ioMatches) {
        ioMatches.forEach(m => {
            if(!formattedDesc.includes('href="'+m) && !formattedDesc.includes('href="http')) {
                // simple replace
            }
        });
    }`;

const processLinksNew = `    // Process links in desc
    let desc = viewProfUser.desc || '-';
    
    // simple URL detection to make discord.gg, youtube.com, tiktok.com, IG links clickable
    const urlRegex = /(https?:\\/\\/[^\\s]+)|(www\\.[^\\s]+)|([^\\s]+\\.(com|net|org|io|gg|me|id|xyz|ly)[^\\s]*)/ig;
    let formattedDesc = desc.replace(urlRegex, (url) => {
        let fullUrl = url;
        if(!url.toLowerCase().startsWith('http')) {
            fullUrl = 'http://' + url;
        }
        return \`<a href="\${fullUrl}" target="_blank" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all">\${url}</a>\`;
    });`;

html = html.replace(processLinksOld, processLinksNew);

// 5. BotXyCs registration
const initBotXyCs = `function initApp() {
    // Ensure BotXyCs account exists
    if(!users['BotXyCs']) {
        users['BotXyCs'] = {
            username: 'BotXyCs', password: 'bot',
            role: 'Dev', photo: 'https://ui-avatars.com/api/?name=XyCs&background=9333ea&color=fff',
            deviceId: 'BOT_ID_000', theme: 'default',
            desc: 'Sistem AI Resmi XyCs. Tanya saya apapun!'
        };
        DB.set('users', users);
    }
`;

html = html.replace('function initApp() {', initBotXyCs);

fs.writeFileSync('index.html', html);
console.log("Applied multi fixes via patch37");
