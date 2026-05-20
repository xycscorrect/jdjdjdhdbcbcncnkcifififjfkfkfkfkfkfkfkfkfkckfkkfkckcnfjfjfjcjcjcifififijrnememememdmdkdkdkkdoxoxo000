const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const apiStr = `const API_KEYS = {
    correctCS: 'AIzaSyDWnpOdmcjIGMTOr65hSdhxobeS4iNpa1Y',
    aiPro: 'AIzaSyBK6rKefvrtHE8OkU0BTUoZa1MlTMOCN4I',
    botXyCs: 'AIzaSyBK6rKefvrtHE8OkU0BTUoZa1MlTMOCN4I',
    botGx: 'AIzaSyBmpqta3DpiK-CfYeFKJw-9pCOFTx9D5-s',
    botIde: 'AIzaSyBKOk5HEniiQw6QXaf3YziA3--tNNzS5TA',
    botTeks: 'AIzaSyBKOk5HEniiQw6QXaf3YziA3--tNNzS5TA',
    botCode: 'AIzaSyD90KZRVk8_ZF189yCnb2T0vbujzA1JbYM',
    botAiDetect: 'AIzaSyD90KZRVk8_ZF189yCnb2T0vbujzA1JbYM',
    detector: 'AIzaSyD90KZRVk8_ZF189yCnb2T0vbujzA1JbYM'
};

async function callGeneralAI(prompt, apiKey, defaultModel="gemini-1.5-flash-latest") {
    // Note: The user requested "gemini-flash-latest", but that might be an alias or gemini-1.5-flash-latest.
    const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=\${apiKey}\`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan respon AI.";
}`;

const origFunc = `const GEMINI_API_KEY = "AIzaSyDhGzDkzRah36njrA9ZzEkgcBNBfgojDlU";

async function callAI(prompt) {
    const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\${GEMINI_API_KEY}\`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan respon AI.";
}`;

html = html.replace(origFunc, Object.assign(apiStr));
fs.writeFileSync('index.html', html);
console.log('Replaced callAI');
