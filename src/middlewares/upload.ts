import { Request } from 'express';
import Fs from 'fs-extra';
import util from 'util';
import multer from 'multer';
import path from 'path';
import { v4 as createUUID } from 'uuid';

const maxSize = 2 * 1024 * 1024 * 1024;
const base = process.cwd();

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        const path = `${base}/public/${req.body.folder ?? 'avatar'}`;
        console.log(path, '--file.path.path.file--');
        Fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req: Request, file: any, cb: any) => {
        const ext = path.extname(file.originalname);
        const virtual_img_url = `av-${new Date().valueOf()}${ext}`;
        cb(null, req.body.folder ? `${createUUID()}${ext}` : virtual_img_url);
        req.body.avatar = virtual_img_url;
    }
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

export const uploadAvatar = util.promisify(uploadFile.single('avatar'));
export const uploadTaskPhotos = util.promisify(uploadFile.array('photos[]', Infinity));
export const uploadTaskFile = util.promisify(uploadFile.single('file'));
