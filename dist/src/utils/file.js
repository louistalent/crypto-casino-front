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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = require("rimraf");
const fs_extra_1 = __importDefault(require("fs-extra"));
// import getFolderSize from 'get-folder-size';
const basePath = path_1.default.join(__dirname, '..', '..', 'public');
const checkAndNewPath = (str, index) => {
    const lastSlashIndex = str.lastIndexOf('\\');
    let fileName = str.substr(lastSlashIndex + 1);
    const filePath = str.substring(0, lastSlashIndex);
    const nameIndex = fileName.lastIndexOf('.');
    let extension = fileName.substr(nameIndex + 1);
    const name = str.substring(0, nameIndex);
    if (fs_1.default.existsSync(`${filePath}`)) {
        return checkAndNewPath(str, index++);
    }
    else {
        return `${filePath}${name}(${index}).${extension}`;
    }
};
const checkFolderPath = (str, index) => {
    if (fs_1.default.existsSync(`${str}(${index})`)) {
        return checkFolderPath(str, index + 1);
    }
    else {
        return { path: `${str}(${index})`, index };
    }
};
/**
 * Create a new folder
 * @param {string} folderPath
 * @returns {Boolean}
 */
const createFolder = (folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let path = path_1.default.join(basePath, folderPath);
        let folderName = folderPath.split('\\').pop();
        if (fs_1.default.existsSync(path)) {
            const checkedName = yield checkFolderPath(path, 1);
            path = checkedName.path;
            folderName = `${folderName}(${checkedName.index})`;
        }
        fs_1.default.mkdirSync(path);
        const data = fs_1.default.statSync(path);
        return { status: true, message: 'Success', data: Object.assign(Object.assign({}, data), { name: folderName }) };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
});
/**
 * Rename a folder | file
 * @param {string} oldNamePath
 * @param {string} newNamePath
 * @returns {Boolean}
 */
const rename = (oldNamePath, newNamePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldPath = path_1.default.join(basePath, oldNamePath);
        let newPath = path_1.default.join(basePath, newNamePath);
        if (fs_1.default.existsSync(newPath)) {
            newPath = yield checkAndNewPath(newPath, 1);
        }
        fs_1.default.renameSync(oldPath, newPath);
        const extension = path_1.default.extname(newPath);
        const fileData = fs_1.default.statSync(newPath);
        const data = {
            name: path_1.default.parse(newPath).base,
            extension,
            size: fileData.size,
            isFile: fileData.isFile(),
            birthtime: fileData.birthtime
        };
        return {
            status: true,
            data
        };
    }
    catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
});
/**
 * remove a folder that contains files
 * @param {string} folderPath
 * @returns {Boolean}
 */
const removeFolder = (folderPath) => {
    try {
        const path = path_1.default.join(basePath, folderPath);
        (0, rimraf_1.sync)(path);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
/**
 * remove a file
 * @param {string} filePath
 * @returns {Boolean}
 */
const removeFile = (filePath) => {
    try {
        const path = path_1.default.join(basePath, filePath);
        fs_1.default.unlinkSync(path);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
/**
 * get folder structure
 * @param {string} folderPath
 * @returns {Array | Boolean}
 */
const getStructure = (folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fileInfo = [];
        const path = path_1.default.join(basePath, folderPath);
        const files = fs_1.default.readdirSync(path);
        for (const item of files) {
            const filePath = path_1.default.join(path, item);
            const extension = path_1.default.extname(item);
            const fileData = fs_1.default.statSync(filePath);
            let infoData = {
                name: item,
                extension,
                isFile: fileData.isFile(),
                modified: fileData.mtime
            };
            if (infoData.isFile) {
                infoData.size = fileData.size;
            }
            else {
                infoData.size = 0;
                // infoData.size = await getFolderSize.loose(filePath);
            }
            fileInfo.push(infoData);
        }
        return fileInfo;
    }
    catch (err) {
        console.error(err);
        return false;
    }
});
/**
 * move a file
 * @param {string} filePath
 * @param {string} newPath
 * @returns {Boolean}
 */
const moveFile = (filePath, newPath) => {
    try {
        const old = path_1.default.join(basePath, filePath);
        const desc = path_1.default.join(basePath, newPath);
        return fs_extra_1.default.moveSync(old, desc);
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
/**
 * get all child files
 * @param {string} folderPath
 * @returns {Boolean}
 */
function getFolderSize(folderPath) {
    const path = path_1.default.join(basePath, folderPath);
    const fileNames = fs_1.default.readdirSync(path);
    let totalSize = 0;
    fileNames.forEach((fileName) => {
        const filePath = path_1.default.join(folderPath, fileName);
        const stats = fs_1.default.statSync(filePath);
        if (stats.isFile()) {
            // If it's a file, add its size to the total
            totalSize += stats.size;
        }
        else if (stats.isDirectory()) {
            // If it's a directory, recursively call the function to get its size
            totalSize += getFolderSize(filePath);
        }
    });
    return totalSize;
}
exports.default = {
    createFolder,
    removeFolder,
    getStructure,
    removeFile,
    rename,
    moveFile,
    getFolderSize
};
//# sourceMappingURL=file.js.map