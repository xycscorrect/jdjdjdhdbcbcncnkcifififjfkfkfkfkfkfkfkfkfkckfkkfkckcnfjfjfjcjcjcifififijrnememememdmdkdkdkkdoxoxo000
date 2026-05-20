const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const navCodeOld = `        if(to === 'bot-detect') hdrLogoSrc = settings.logos.botDetect;
        DB.set('botChats', botChats); DB.set('botChats', botChats); DB.set('botChats', botChats); DB.set('botChats', botChats); DB.set('botChats', botChats); renderBotChat();
    }
    document.getElementById('header-title').innerText = title;
    document.getElementById('header-logo').src = hdrLogoSrc;
    document.getElementById('header-actions').innerHTML = '';
}

/* ======================== `;

const navCodeNew = `        if(to === 'bot-detect') hdrLogoSrc = settings.logos.botDetect;
        renderBotChat();
    }
    document.getElementById('header-title').innerText = title;
    document.getElementById('header-logo').src = hdrLogoSrc;
    
    // Default empty, but if bot, add action buttons
    let actHtml = '';
    if(to.startsWith('bot-')) {
        actHtml = \`<button class="text-sky-400 hover:text-white bg-gray-800 p-2 rounded mr-1" onclick="openBotSessionsModal()"><i class="fas fa-history"></i></button>\`;
    }
    document.getElementById('header-actions').innerHTML = actHtml;
}

/* ======================== `;

// Let's do string split to be 100% safe
let p = html.split("document.getElementById('header-actions').innerHTML = '';");
if(p.length === 2) {
    let p2 = p[0].split("DB.set('botChats', botChats); ").join(" ");
    html = p2 + `
    let actHtml = '';
    if(to.startsWith('bot-')) {
        actHtml = \`<button class="text-sky-400 hover:text-white bg-gray-800 p-2 rounded ml-1" onclick="openBotSessionsModal()"><i class="fas fa-history"></i></button>
                   <button class="text-sky-400 hover:text-white bg-gray-800 p-2 rounded" onclick="newBotChat()"><i class="fas fa-plus"></i></button>\`;
    }
    document.getElementById('header-actions').innerHTML = actHtml;
    ` + p[1];
    fs.writeFileSync('index.html', html);
    console.log("Replaced header actions successfully.");
} else {
    console.log("Failed to split header-actions line");
}
