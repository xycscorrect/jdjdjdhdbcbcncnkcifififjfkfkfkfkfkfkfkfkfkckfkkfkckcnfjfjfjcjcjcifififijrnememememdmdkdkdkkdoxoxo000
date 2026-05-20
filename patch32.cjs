const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const roleSelectHtml = ` <select id="prof-role-input" class="hidden bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white max-w-[100px]"></select>`;
html = html.replace(`<span id="prof-role-badge"`, roleSelectHtml + ` <span id="prof-role-badge"`);

const openProfileLogic = `    const canEditProf = isMe || currentUser.role.toLowerCase().includes('dev') || currentUser.role.toLowerCase().includes('admin');
    
    document.getElementById('prof-edit-overlay').classList.add('hidden');
    
    if(canEditProf) {
        document.getElementById('prof-edit-overlay').classList.remove('hidden');
        actBox.innerHTML += \`<button class="flex-1 bg-sky-600 hover:bg-sky-500 shadow-lg py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2" onclick="editProfileMode()"><i class="fas fa-edit"></i> Edit Profil</button>\`;
    } 
    // Always add PM button if it's NOT me
    if(!isMe) {
        actBox.innerHTML += \`<button class="flex-1 bg-green-600 hover:bg-green-500 shadow-lg py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2" onclick="closeProfile(); openPM('\${uname}')"><i class="fas fa-paper-plane"></i> Kirim PM</button>\`;
    }`;

// Wait, the original was:
const origEditIf = `    if(isMe) {
        document.getElementById('prof-edit-overlay').classList.remove('hidden');
        actBox.innerHTML += \`<button class="flex-1 bg-sky-600 hover:bg-sky-500 shadow-lg py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2" onclick="editProfileMode()"><i class="fas fa-edit"></i> Edit Profil</button>\`;
    } else {
        actBox.innerHTML += \`<button class="flex-1 bg-green-600 hover:bg-green-500 shadow-lg py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2" onclick="closeProfile(); openPM('\${uname}')"><i class="fas fa-paper-plane"></i> Kirim PM</button>\`;
    }`;

html = html.replace(origEditIf, openProfileLogic);

const editProfileModeLogic = `function editProfileMode() {
    const isMe = viewProfUser.username === currentUser.username;
    const canEditRole = !isMe && (currentUser.role.toLowerCase().includes('dev') || currentUser.role.toLowerCase().includes('admin'));
    
    document.getElementById('prof-desc-text').classList.add('hidden');
    document.getElementById('prof-name').classList.add('hidden');
    document.getElementById('prof-name-input').value = viewProfUser.username;
    document.getElementById('prof-name-input').classList.remove('hidden');
    document.getElementById('prof-pass-input').classList.remove('hidden');
    
    if(canEditRole) {
        document.getElementById('prof-role-badge').classList.add('hidden');
        let sel = document.getElementById('prof-role-input');
        sel.innerHTML = Object.keys(customRoles).map(k => \`<option value="\${k}" \${k===viewProfUser.role?'selected':''}>\${k}</option>\`).join('');
        sel.classList.remove('hidden');
    }
`;

html = html.replace(/function editProfileMode\(\) \{[\s\S]*?document\.getElementById\('prof-name-input'\)\.classList\.remove\('hidden'\);\n    document\.getElementById\('prof-pass-input'\)\.classList\.remove\('hidden'\);/, editProfileModeLogic);

const saveProfileLogic = `function saveProfile() {
    viewProfUser.desc = document.getElementById('prof-desc-input').value;
    let oldUname = viewProfUser.username;
    let newUname = document.getElementById('prof-name-input').value.trim() || oldUname;
    let newPw = document.getElementById('prof-pass-input').value.trim();
    
    if(!document.getElementById('prof-role-input').classList.contains('hidden')) {
        viewProfUser.role = document.getElementById('prof-role-input').value;
    }
`;
html = html.replace(/function saveProfile\(\) \{[\s\S]*?let newPw = document\.getElementById\('prof-pass-input'\)\.value\.trim\(\);/, saveProfileLogic);

const cleanupSave = `    document.getElementById('prof-name').classList.remove('hidden');
    document.getElementById('prof-name-input').classList.add('hidden');
    document.getElementById('prof-pass-input').classList.add('hidden');
    document.getElementById('prof-role-input').classList.add('hidden');
    document.getElementById('prof-role-badge').classList.remove('hidden');`;

html = html.replace(/    document\.getElementById\('prof-name'\)\.classList\.remove\('hidden'\);\n    document\.getElementById\('prof-name-input'\)\.classList\.add\('hidden'\);\n    document\.getElementById\('prof-pass-input'\)\.classList\.add\('hidden'\);/, cleanupSave);

fs.writeFileSync('index.html', html);
console.log('Added profile role edit logic');
