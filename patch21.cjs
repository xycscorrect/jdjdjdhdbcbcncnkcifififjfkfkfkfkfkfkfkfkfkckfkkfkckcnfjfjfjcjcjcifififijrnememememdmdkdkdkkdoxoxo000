const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const previewModal = `<!-- Image Preview Modal -->
<div id="modal-image-preview" class="hidden fixed inset-0 z-[99999] bg-black/90 flex flex-col justify-center items-center backdrop-blur-sm p-4">
    <div class="relative w-full h-full flex justify-center items-center">
        <button onclick="document.getElementById('modal-image-preview').classList.add('hidden')" class="absolute top-4 right-4 text-white hover:text-red-500 font-bold text-4xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center">&times;</button>
        <img id="image-preview-content" class="max-w-full max-h-[90vh] object-contain rounded shadow-2xl border border-gray-700">
    </div>
</div>
`;

if (!html.includes('id="modal-image-preview"')) {
    html = html.replace('</body>', previewModal + '\n</body>');
    fs.writeFileSync('index.html', html);
    console.log('Added image preview modal');
} else {
    console.log('Already has modal-image-preview');
}
