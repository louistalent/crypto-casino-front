import { NextFunction, Request, Response } from 'express';
// import FileManage from '../utils/file';
import { AuthRequest } from './auth';
// import { fileService } from '../services';

export const uploadValdiation = (createCustomer: any, path: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { body } = req;
        const result = await createCustomer.validate(body);
        // req.body.avatarUrl = req.file.originalname;
        if (result.error && req.file) {
            // FileManage.removeFile(path + req.file.filename);
        } else {
            if (req.file) {
                const data = {
                    name: req.file.filename,
                    originalName: req.file.originalname,
                    size: req.file.size,
                    link: req.file.filename,
                    type: req.file.mimetype
                };
                // const file = await fileService.saveFile(data);
                // if (file.name) {
                //     req.body.avatarUrl = file.name;
                // }
            }
        }
        next();
    };
};
