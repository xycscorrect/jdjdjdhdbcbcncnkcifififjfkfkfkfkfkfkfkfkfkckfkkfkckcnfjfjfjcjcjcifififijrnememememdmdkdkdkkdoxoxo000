const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('id="nav-admin-roles"')) {
    const btnRole = `                    <button onclick="nav('admin-roles')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-700 transition text-sky-400 nav-item" id="nav-admin-roles">
                        <i class="fas fa-users-cog w-5 text-center"></i> Role Mgmt
                    </button>`;
    html = html.replace(`<button onclick="nav('admin-logs')"`, btnRole + `\n                    <button onclick="nav('admin-logs')"`);
}

if (!html.includes('id="view-admin-roles"')) {
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
    html = html.replace('<!-- View: Auth -->', roleMgmtHTML + '\n            <!-- View: Auth -->');
}

if (!html.includes('view-admin-roles\').classList.remove')) {
const jsRoleNav = `    } else if (to === 'admin-roles') {
        document.getElementById('view-admin-roles').classList.remove('hidden');
        title = "Role Management"; renderRolesAdmin();`;
    html = html.replace("    } else if (to === 'admin') {", jsRoleNav + "\n    } else if (to === 'admin') {");
}

fs.writeFileSync('index.html', html);
console.log("Fixed Role Mgmt injection");
