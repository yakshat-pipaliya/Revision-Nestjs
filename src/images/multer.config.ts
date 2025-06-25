import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = '/var/www/html/images';
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, callback) => {
            callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
            // callback(null, file.originalname);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|zip)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
