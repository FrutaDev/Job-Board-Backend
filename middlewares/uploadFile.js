const multer = require('multer');
const path = require('path');

const createStorage = (folder) =>
    multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folder}/`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes.'), false);
    }
};

const pdfFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('application/pdf')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo PDF.'), false);
    }
};

const uploadLogo = multer({
    storage: createStorage("logos"),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadCV = multer({
    storage: createStorage("cvs"),
    fileFilter: pdfFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { uploadLogo, uploadCV };
