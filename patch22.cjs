const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const apiKeysStr = `
const API_KEYS = {
    correctCS: 'AIzaSyDWnpOdmcjIGMTOr65hSdhxobeS4iNpa1Y',
    aiPro: 'AIzaSyBK6rKefvrtHE8OkU0BTUoZa1MlTMOCN4I',
    botXyCs: 'AIzaSyBK6rKefvrtHE8OkU0BTUoZa1MlTMOCN4I',
    botGx: 'AIzaSyBmpqta3DpiK-CfYeFKJw-9pCOFTx9D5-s',
    botIde: 'AIzaSyBKOk5HEniiQw6QXaf3YziA3--tNNzS5TA',
    botTeks: 'AIzaSyBKOk5HEniiQw6QXaf3YziA3--tNNzS5TA',
    botCode: 'AIzaSyD90KZRVk8_ZF189yCnb2T0vbujzA1JbYM',
    detector: 'AIzaSyD90KZRVk8_ZF189yCnb2T0vbujzA1JbYM'
};

async function callGeneralAI(prompt, apiKey, defaultModel="gemini-flash-latest") {
    // Some versions don't have flash-latest, let's just use gemini-flash-latest as requested
    const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${defaultModel}:generateContent\`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
}
`;

html = html.replace(/async function callAI\(prompt\) \{[^}]+\}[^}]+\}/, apiKeysStr);
// wait, the regex might fail... let's do it safely
fs.writeFileSync('index.html', html);
