import multer from "multer";
import { ValidationError } from "../errors/validationError.js";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf',
            // 'video/mp4',
            // 'video/quicktime',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new ValidationError('File type not allowed. Allowed: pdf, mp4, mov, docx'),
                false
            );
        }

        cb(null, true);
    }
})