"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTaskFile = exports.uploadTaskPhotos = exports.uploadAvatar = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const maxSize = 2 * 1024 * 1024 * 1024;
const base = process.cwd();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        var _a;
        const path = `${base}/public/${(_a = req.body.folder) !== null && _a !== void 0 ? _a : 'avatar'}`;
        console.log(path, '--file.path.path.file--');
        fs_extra_1.default.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const virtual_img_url = `av-${new Date().valueOf()}${ext}`;
        cb(null, req.body.folder ? `${(0, uuid_1.v4)()}${ext}` : virtual_img_url);
        req.body.avatar = virtual_img_url;
    }
});
const uploadFile = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: maxSize }
});
exports.uploadAvatar = util_1.default.promisify(uploadFile.single('avatar'));
exports.uploadTaskPhotos = util_1.default.promisify(uploadFile.array('photos[]', Infinity));
exports.uploadTaskFile = util_1.default.promisify(uploadFile.single('file'));
//# sourceMappingURL=upload.js.map