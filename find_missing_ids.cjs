const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

const idMatches = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const getIdMatches = [...html.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);

const missing = new Set(getIdMatches.filter(id => !idMatches.includes(id) && !['', 'app', 'root', 'msg-act-.*'].includes(id)));

console.log([...missing].join('\n'));
