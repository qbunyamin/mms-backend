const multer = require('multer');
const path = require('path');

// Dosya uzantısı kontrolü
const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.dwg'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Geçersiz dosya türü'), false);
    }
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
});
