const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const roleInitStr = `let defaultRoles = {
    'Admin': { text: 'Admin', icon: '👑', colorCls: 'text-red-400', badgeCls: 'border-red-500 text-red-400 bg-red-900/20', perms: ['admin'] },
    'Dev': { text: 'Dev', icon: '🛠️', colorCls: 'text-purple-400', badgeCls: 'border-purple-500 text-purple-400 bg-purple-900/20', perms: ['admin', 'dev'] },
    'Perisai': { text: 'Perisai', icon: '🛡️', colorCls: 'text-sky-400', badgeCls: 'border-sky-500 text-sky-400 bg-sky-900/20', perms: [] }
};
let customRoles = DB.get('customRoles', defaultRoles);

function getRoleInfo(roleStr) {
    let r = roleStr ? roleStr.trim() : 'Perisai';
    if(customRoles[r]) return customRoles[r];
    
    // Default matching logic if specific custom role not found
    let def = { text: r, icon: '🛡️', colorCls: 'text-sky-400', badgeCls: 'border-sky-500 text-sky-400 bg-sky-900/20', perms: [] };
    let t = r.toLowerCase();
    
    if(t.includes('dev')) {
        def = { text: r, icon: '🛠️', colorCls: 'text-purple-400', badgeCls: 'border-purple-500 text-purple-400 bg-purple-900/20', perms: ['admin', 'dev'] };
    } else if(t.includes('admin')) {
        def = { text: r, icon: '👑', colorCls: 'text-red-400', badgeCls: 'border-red-500 text-red-400 bg-red-900/20', perms: ['admin'] };
    }
    return def;
}`;

html = html.replace(/function getRoleInfo\(roleStr\)\s*\{[\s\S]*?return \{ text, icon, colorCls, badgeCls \};\n\}/, roleInitStr);

fs.writeFileSync('index.html', html);
console.log('Replaced custom role function');
