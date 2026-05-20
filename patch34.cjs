const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const profileFieldsOld = `<h2 class="text-2xl font-bold text-white flex items-center gap-2"><span id="prof-name">Name</span>
    <input type="text" id="prof-name-input" class="hidden bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white w-24">
    <input type="password" id="prof-pass-input" class="hidden bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white w-24 mt-1" placeholder="New PW">  <select id="prof-role-input" class="hidden bg-gray-900 border border-gray-600 rounded p-1 text-sm text-white max-w-[100px]"></select> <span id="prof-role-badge" class="px-2 py-0.5 text-xs rounded border border-gray-500">Role</span></h2>`;

const profileFieldsNew = `<h2 class="text-2xl font-bold text-white flex items-center gap-2"><span id="prof-name">Name</span> <span id="prof-role-badge" class="px-2 py-0.5 text-xs rounded border border-gray-500">Role</span></h2>
    <div id="prof-edit-fields" class="hidden flex flex-col gap-2 mt-3 mb-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <label class="text-xs text-gray-400 font-bold uppercase">Ubah Username</label>
        <input type="text" id="prof-name-input" class="bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white w-full" placeholder="Username Baru">
        
        <label class="text-xs text-gray-400 font-bold uppercase mt-1">Ubah Password</label>
        <input type="password" id="prof-pass-input" class="bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white w-full" placeholder="Isi jika ingin ganti password...">
        
        <div id="prof-role-container" class="hidden mt-1">
            <label class="text-xs text-gray-400 font-bold uppercase">Ubah Role (Khusus Admin/Dev)</label>
            <select id="prof-role-input" class="bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white w-full mt-1"></select>
        </div>
    </div>`;

html = html.replace(profileFieldsOld, profileFieldsNew);

const jsModOld1 = `    document.getElementById('prof-name').classList.add('hidden');
    document.getElementById('prof-name-input').value = viewProfUser.username;
    document.getElementById('prof-name-input').classList.remove('hidden');
    document.getElementById('prof-pass-input').classList.remove('hidden');
    
    if(canEditRole) {
        document.getElementById('prof-role-badge').classList.add('hidden');
        let sel = document.getElementById('prof-role-input');
        sel.innerHTML = Object.keys(customRoles).map(k => \`<option value="\${k}" \${k===viewProfUser.role?'selected':''}>\${k}</option>\`).join('');
        sel.classList.remove('hidden');
    }`;

const jsModNew1 = `    document.getElementById('prof-name').classList.add('hidden');
    document.getElementById('prof-role-badge').classList.add('hidden');
    document.getElementById('prof-edit-fields').classList.remove('hidden');
    document.getElementById('prof-name-input').value = viewProfUser.username;
    
    if(canEditRole) {
        let sel = document.getElementById('prof-role-input');
        sel.innerHTML = Object.keys(customRoles).map(k => \`<option value="\${k}" \${k===viewProfUser.role?'selected':''}>\${k}</option>\`).join('');
        document.getElementById('prof-role-container').classList.remove('hidden');
    } else {
        document.getElementById('prof-role-container').classList.add('hidden');
    }`;

html = html.replace(jsModOld1, jsModNew1);

const jsModOld2 = `    document.getElementById('prof-name').classList.remove('hidden');
    document.getElementById('prof-name-input').classList.add('hidden');
    document.getElementById('prof-pass-input').classList.add('hidden');
    document.getElementById('prof-role-input').classList.add('hidden');
    document.getElementById('prof-role-badge').classList.remove('hidden');`;

const jsModNew2 = `    document.getElementById('prof-name').classList.remove('hidden');
    document.getElementById('prof-role-badge').classList.remove('hidden');
    document.getElementById('prof-edit-fields').classList.add('hidden');
    document.getElementById('prof-role-container').classList.add('hidden');
    document.getElementById('prof-pass-input').value = '';`;

html = html.replace(jsModOld2, jsModNew2);

// Check if there are missing parts. Let's do it carefully.
fs.writeFileSync('index.html', html);
