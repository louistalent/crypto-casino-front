"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadValdiation = void 0;
// import { fileService } from '../services';
const uploadValdiation = (createCustomer, path) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = req;
        const result = yield createCustomer.validate(body);
        // req.body.avatarUrl = req.file.originalname;
        if (result.error && req.file) {
            // FileManage.removeFile(path + req.file.filename);
        }
        else {
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
    });
};
exports.uploadValdiation = uploadValdiation;
//# sourceMappingURL=uploadValidation.js.map