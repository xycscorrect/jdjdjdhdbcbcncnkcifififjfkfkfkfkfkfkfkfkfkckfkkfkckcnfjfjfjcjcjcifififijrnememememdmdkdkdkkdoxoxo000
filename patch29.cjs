const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const onclickProfPhoto = `<img id="prof-photo" class="circle-logo w-24 h-24 border-4 border-gray-800 bg-gray-900 cursor-pointer" onclick="previewImage(this.src)">`;
html = html.replace(`<img id="prof-photo" class="circle-logo w-24 h-24 border-4 border-gray-800 bg-gray-900">`, onclickProfPhoto);

const pmPhotoMod = `<img id="pm-chat-photo" class="circle-logo w-8 h-8 cursor-pointer" onclick="event.stopPropagation(); previewImage(this.src)">`;
html = html.replace(`<img id="pm-chat-photo" class="circle-logo w-8 h-8">`, pmPhotoMod);

const headLogoMod = `<img id="header-logo" class="logo-main circle-logo w-8 h-8 cursor-pointer" src="" onclick="previewImage(this.src)">`;
html = html.replace(`<img id="header-logo" class="logo-main circle-logo w-8 h-8" src="">`, headLogoMod);

const navUserPhoto = `<img id="nav-user-photo" src="" class="circle-logo w-12 h-12 cursor-pointer hover:opacity-80 transition" alt="Me" onclick="previewImage(this.src)">`;
html = html.replace(`<img id="nav-user-photo" src="" class="circle-logo w-12 h-12 cursor-pointer hover:opacity-80 transition" alt="Me" onclick="openProfile(currentUser.username)">`, navUserPhoto);

// Actually, clicking nav-user-photo shouldn't just be preview, but openProfile. Wait, if they wanted preview... let's stick to openProfile, but inside profile they can click it!
html = html.replace(navUserPhoto, `<img id="nav-user-photo" src="" class="circle-logo w-12 h-12 cursor-pointer hover:opacity-80 transition" alt="Me" onclick="openProfile(currentUser.username)">`);

fs.writeFileSync('index.html', html);
console.log('Added avatar preview capabilities');
