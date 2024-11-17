import Fs from 'fs';
import Path from 'path';
import { sync } from 'rimraf';
import fsExtra from 'fs-extra';
// import getFolderSize from 'get-folder-size';

const basePath = Path.join(__dirname, '..', '..', 'public');

const checkAndNewPath = (str: string, index: number) => {
    const lastSlashIndex = str.lastIndexOf('\\');
    let fileName = str.substr(lastSlashIndex + 1);
    const filePath = str.substring(0, lastSlashIndex);

    const nameIndex = fileName.lastIndexOf('.');
    let extension = fileName.substr(nameIndex + 1);
    const name = str.substring(0, nameIndex);

    if (Fs.existsSync(`${filePath}`)) {
        return checkAndNewPath(str, index++);
    } else {
        return `${filePath}${name}(${index}).${extension}`;
    }
};

const checkFolderPath = (str: string, index: number) => {
    if (Fs.existsSync(`${str}(${index})`)) {
        return checkFolderPath(str, index + 1);
    } else {
        return { path: `${str}(${index})`, index };
    }
};

/**
 * Create a new folder
 * @param {string} folderPath
 * @returns {Boolean}
 */
const createFolder = async (folderPath: string) => {
    try {
        let path = Path.join(basePath, folderPath);

        let folderName = folderPath.split('\\').pop();

        if (Fs.existsSync(path)) {
            const checkedName = await checkFolderPath(path, 1);
            path = checkedName.path;
            folderName = `${folderName}(${checkedName.index})`;
        }
        Fs.mkdirSync(path);
        const data = Fs.statSync(path);
        return { status: true, message: 'Success', data: { ...data, name: folderName } };
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};

/**
 * Rename a folder | file
 * @param {string} oldNamePath
 * @param {string} newNamePath
 * @returns {Boolean}
 */
const rename = async (oldNamePath: string, newNamePath: string) => {
    try {
        const oldPath = Path.join(basePath, oldNamePath);
        let newPath = Path.join(basePath, newNamePath);

        if (Fs.existsSync(newPath)) {
            newPath = await checkAndNewPath(newPath, 1);
        }
        Fs.renameSync(oldPath, newPath);

        const extension = Path.extname(newPath);
        const fileData = Fs.statSync(newPath);
        const data = {
            name: Path.parse(newPath).base,
            extension,
            size: fileData.size,
            isFile: fileData.isFile(),
            birthtime: fileData.birthtime
        };
        return {
            status: true,
            data
        };
    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};

/**
 * remove a folder that contains files
 * @param {string} folderPath
 * @returns {Boolean}
 */
const removeFolder = (folderPath: string) => {
    try {
        const path = Path.join(basePath, folderPath);
        sync(path);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * remove a file
 * @param {string} filePath
 * @returns {Boolean}
 */
const removeFile = (filePath: string) => {
    try {
        const path = Path.join(basePath, filePath);
        Fs.unlinkSync(path);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * get folder structure
 * @param {string} folderPath
 * @returns {Array | Boolean}
 */
const getStructure = async (folderPath: string) => {
    try {
        let fileInfo = [];
        const path = Path.join(basePath, folderPath);
        const files = Fs.readdirSync(path);
        for (const item of files) {
            const filePath = Path.join(path, item);
            const extension = Path.extname(item);
            const fileData = Fs.statSync(filePath);

            let infoData: any = {
                name: item,
                extension,
                isFile: fileData.isFile(),
                modified: fileData.mtime
            };

            if (infoData.isFile) {
                infoData.size = fileData.size;
            } else {
                infoData.size = 0;
                // infoData.size = await getFolderSize.loose(filePath);
            }
            fileInfo.push(infoData);
        }
        return fileInfo;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * move a file
 * @param {string} filePath
 * @param {string} newPath
 * @returns {Boolean}
 */
const moveFile = (filePath: string, newPath: string) => {
    try {
        const old = Path.join(basePath, filePath);
        const desc = Path.join(basePath, newPath);
        return fsExtra.moveSync(old, desc);
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * get all child files
 * @param {string} folderPath
 * @returns {Boolean}
 */
function getFolderSize(folderPath: string) {
    const path = Path.join(basePath, folderPath);
    const fileNames = Fs.readdirSync(path);

    let totalSize = 0;

    fileNames.forEach((fileName) => {
        const filePath = Path.join(folderPath, fileName);
        const stats = Fs.statSync(filePath);

        if (stats.isFile()) {
            // If it's a file, add its size to the total
            totalSize += stats.size;
        } else if (stats.isDirectory()) {
            // If it's a directory, recursively call the function to get its size
            totalSize += getFolderSize(filePath);
        }
    });

    return totalSize;
}

export default {
    createFolder,
    removeFolder,
    getStructure,
    removeFile,
    rename,
    moveFile,
    getFolderSize
};
