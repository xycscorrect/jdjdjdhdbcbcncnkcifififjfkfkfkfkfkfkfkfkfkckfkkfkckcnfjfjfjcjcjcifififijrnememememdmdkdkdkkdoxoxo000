const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const roleMgmtHTML = `
            <!-- View: Admin Roles -->
            <div id="view-admin-roles" class="view-panel flex-1 overflow-y-auto p-4 custom-scroll hidden">
                <div class="max-w-4xl mx-auto space-y-6">
                    <h2 class="text-2xl font-bold border-b border-gray-700 pb-2"><i class="fas fa-users-cog text-sky-400"></i> Role Management</h2>
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <div class="flex flex-col md:flex-row gap-4 mb-4">
                            <input type="text" id="role-name-input" class="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white outline-none" placeholder="Role Name (e.g. VIP)">
                            <input type="text" id="role-icon-input" class="w-20 bg-gray-900 border border-gray-700 p-2 rounded text-white outline-none" placeholder="Icon 💎">
                            <input type="text" id="role-color-input" class="w-32 bg-gray-900 border border-gray-700 p-2 rounded text-white outline-none" placeholder="text-pink-400">
                            <button onclick="saveNewRole()" class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded font-bold">Add / Edit</button>
                        </div>
                        <div class="text-xs text-gray-400 mb-4">Permissions (comma separated, e.g. admin, dev)</div>
                        <input type="text" id="role-perms-input" class="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white outline-none mb-4" placeholder="admin">
                        
                        <div class="overflow-x-auto bg-gray-900 rounded border border-gray-700">
                            <table class="w-full text-left text-sm whitespace-nowrap">
                                <thead class="bg-gray-800 border-b border-gray-700 text-gray-400 uppercase text-xs">
                                    <tr><th class="p-3">Role</th><th class="p-3">Icon</th><th class="p-3">Color Class</th><th class="p-3">Perms</th><th class="p-3">Aksi</th></tr>
                                </thead>
                                <tbody id="roles-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
`;

// Insert after admin-logs
html = html.replace('            <!-- View: Auth -->', roleMgmtHTML + '\n            <!-- View: Auth -->');

const btnRole = `
                <button onclick="nav('admin-roles')" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-700 transition nav-item" id="nav-admin-roles">
                    <i class="fas fa-users-cog w-5 text-center text-sky-400"></i> Role Mgmt
                </button>
`;
html = html.replace(`                <button onclick="nav('admin-settings')"`, btnRole + `\n                <button onclick="nav('admin-settings')"`);

const jsRole = `
    } else if (to === 'admin-roles') {
        document.getElementById('view-admin-roles').classList.remove('hidden');
        title = "Role Management"; renderRolesAdmin();
`;
html = html.replace(`    } else if (to === 'admin-settings') {`, jsRole + `\n    } else if (to === 'admin-settings') {`);

const logicRoles = `
/* ======================== 
     ROLE MANAGEMENT
======================== */
function renderRolesAdmin() {
    const tb = document.getElementById('roles-tbody');
    tb.innerHTML = Object.keys(customRoles).map(k => {
        let r = customRoles[k];
        return \`
        <tr class="border-b border-gray-700/50 hover:bg-gray-800">
            <td class="p-3 font-bold">\${k}</td>
            <td class="p-3">\${r.icon}</td>
            <td class="p-3">\${r.colorCls}</td>
            <td class="p-3 text-xs">\${r.perms ? r.perms.join(', ') : ''}</td>
            <td class="p-3">
               \${ (k === 'Admin' || k === 'Dev' || k === 'Perisai') ? 
               '<span class="text-xs text-orange-400">System Role</span>' : 
               \`<button onclick="editRole('\${k}')" class="text-sky-400 hover:text-sky-300 mr-2"><i class="fas fa-edit"></i></button>
                <button onclick="deleteRole('\${k}')" class="text-red-400 hover:text-red-300"><i class="fas fa-trash"></i></button>\` }
            </td>
        </tr>\`;
    }).join('');
}

function saveNewRole() {
    let name = document.getElementById('role-name-input').value.trim();
    let icon = document.getElementById('role-icon-input').value.trim();
    let color = document.getElementById('role-color-input').value.trim() || 'text-sky-400';
    let perms = document.getElementById('role-perms-input').value.trim().split(',').map(s=>s.trim()).filter(Boolean);
    
    if(!name || !icon) return alert("Sertakan Role & Icon!");
    
    let bgCol = color.replace('text-', 'bg-').split('-')[0] + '-900/20';
    let borderCol = color.replace('text-', 'border-');
    
    customRoles[name] = {
        text: name, icon: icon, colorCls: color,
        badgeCls: \`\${borderCol} \${color} \${bgCol}\`,
        perms: perms
    };
    DB.set('customRoles', customRoles);
    
    document.getElementById('role-name-input').value = '';
    document.getElementById('role-icon-input').value = '';
    document.getElementById('role-color-input').value = '';
    document.getElementById('role-perms-input').value = '';
    renderRolesAdmin();
    // Re-render chat and nav
    initApp();
}

function editRole(name) {
    let r = customRoles[name];
    if(!r) return;
    document.getElementById('role-name-input').value = name;
    document.getElementById('role-icon-input').value = r.icon;
    document.getElementById('role-color-input').value = r.colorCls;
    document.getElementById('role-perms-input').value = r.perms ? r.perms.join(', ') : '';
}

function deleteRole(name) {
    if(confirm("Hapus role " + name + "? User dengan role ini akan kembali ke Perisai.")) {
        delete customRoles[name];
        DB.set('customRoles', customRoles);
        renderRolesAdmin();
    }
}
`;

html = html.replace(`/* ======================== \n     ADMIN & LOGS`, logicRoles + `\n/* ======================== \n     ADMIN & LOGS`);

fs.writeFileSync('index.html', html);
console.log('Added role management and logic');
