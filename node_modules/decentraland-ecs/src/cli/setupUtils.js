"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaticRoutes = exports.getDirectories = exports.defaultDclIgnore = exports.shaHashMaker = exports.downloadFile = exports.ensureCopyFile = exports.ensureWriteFile = exports.getSceneJson = exports.entityV3FromFolder = exports.getFilesFromFolder = exports.defaultHashMaker = exports.copyDir = void 0;
const sdk_1 = require("@dcl/schemas/dist/sdk");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const glob_1 = require("glob");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const ignore_1 = __importDefault(require("ignore"));
const path = __importStar(require("path"));
// instead of using fs-extra, create a custom function to no need to rollup
async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        entry.isDirectory()
            ? await copyDir(srcPath, destPath)
            : await fs.promises.copyFile(srcPath, destPath);
    }
}
exports.copyDir = copyDir;
const defaultHashMaker = (str) => 'b64-' + Buffer.from(str).toString('base64');
exports.defaultHashMaker = defaultHashMaker;
const getFilesFromFolder = ({ folder, addOriginalPath, ignorePattern, customHashMaker }) => {
    const hashMaker = customHashMaker ? customHashMaker : exports.defaultHashMaker;
    const allFiles = (0, glob_1.sync)('**/*', {
        cwd: folder,
        dot: false,
        absolute: true
    })
        .map((file) => {
        try {
            if (!fs.statSync(file).isFile())
                return;
        }
        catch (err) {
            return;
        }
        const _folder = folder.replace(/\\/gi, '/');
        const key = file.replace(_folder, '').replace(/^\/+/, '');
        return key;
    })
        .filter(($) => !!$);
    const ensureIgnorePattern = ignorePattern && ignorePattern !== '' ? ignorePattern : (0, exports.defaultDclIgnore)();
    const ig = (0, ignore_1.default)().add(ensureIgnorePattern);
    const filteredFiles = ig.filter(allFiles);
    return filteredFiles
        .map((file) => {
        const absolutePath = path.resolve(folder, file);
        try {
            if (!fs.statSync(absolutePath).isFile())
                return;
        }
        catch (err) {
            console.log(err);
            return;
        }
        const absoluteFolder = folder.replace(/\\/gi, '/');
        const relativeFilePathToFolder = file
            .replace(absoluteFolder, '')
            .replace(/^\/+/, '');
        return {
            file: relativeFilePathToFolder.toLowerCase(),
            original_path: addOriginalPath ? absolutePath : undefined,
            hash: hashMaker(absolutePath)
        };
    })
        .filter(($) => !!$);
};
exports.getFilesFromFolder = getFilesFromFolder;
function entityV3FromFolder({ folder, addOriginalPath, ignorePattern, customHashMaker }) {
    const sceneJsonPath = path.resolve(folder, './scene.json');
    let isParcelScene = true;
    const wearableJsonPath = path.resolve(folder, './wearable.json');
    if (fs.existsSync(wearableJsonPath)) {
        try {
            const wearableJson = JSON.parse(fs.readFileSync(wearableJsonPath).toString());
            if (!sdk_1.WearableJson.validate(wearableJson)) {
                const errors = (sdk_1.WearableJson.validate.errors || [])
                    .map((a) => `${a.data} ${a.message}`)
                    .join('');
                console.error(`Unable to validate wearable.json properly, please check it.`, errors);
                console.error(`Invalid wearable.json (${wearableJsonPath})`);
            }
            else {
                isParcelScene = false;
            }
        }
        catch (err) {
            console.error(`Unable to load wearable.json properly`, err);
        }
    }
    const hashMaker = customHashMaker ? customHashMaker : exports.defaultHashMaker;
    if (fs.existsSync(sceneJsonPath) && isParcelScene) {
        const sceneJson = JSON.parse(fs.readFileSync(sceneJsonPath).toString());
        const { base, parcels } = sceneJson.scene;
        const pointers = new Set();
        pointers.add(base);
        parcels.forEach(($) => pointers.add($));
        const mappedFiles = (0, exports.getFilesFromFolder)({
            folder,
            addOriginalPath,
            ignorePattern,
            customHashMaker
        });
        return {
            version: 'v3',
            type: 'scene',
            id: hashMaker(folder),
            pointers: Array.from(pointers),
            timestamp: Date.now(),
            metadata: sceneJson,
            content: mappedFiles
        };
    }
    return null;
}
exports.entityV3FromFolder = entityV3FromFolder;
function getSceneJson({ baseFolders, pointers, customHashMaker }) {
    const requestedPointers = new Set(pointers);
    const resultEntities = [];
    const allDeployments = baseFolders.map((folder) => {
        const dclIgnorePath = path.resolve(folder, '.dclignore');
        let ignoreFileContent = '';
        if (fs.existsSync(dclIgnorePath)) {
            ignoreFileContent = fs.readFileSync(path.resolve(folder, '.dclignore'), 'utf-8');
        }
        return entityV3FromFolder({
            folder,
            addOriginalPath: false,
            ignorePattern: ignoreFileContent,
            customHashMaker
        });
    });
    for (const pointer of Array.from(requestedPointers)) {
        // get deployment by pointer
        const theDeployment = allDeployments.find(($) => $ && $.pointers.includes(pointer));
        if (theDeployment) {
            // remove all the required pointers from the requestedPointers set
            // to prevent sending duplicated entities
            theDeployment.pointers.forEach(($) => requestedPointers.delete($));
            // add the deployment to the results
            resultEntities.push(theDeployment);
        }
    }
    return resultEntities;
}
exports.getSceneJson = getSceneJson;
async function ensureWriteFile(filePath, data) {
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    }
    await fs.promises.writeFile(filePath, data, 'utf-8');
}
exports.ensureWriteFile = ensureWriteFile;
async function ensureCopyFile(fromFilePath, filePath) {
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    }
    await fs.promises.copyFile(fromFilePath, filePath);
}
exports.ensureCopyFile = ensureCopyFile;
const downloadFile = async (url, path, timeout_seg = 15) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path);
        let schema = http;
        if (url.toLowerCase().startsWith('https:')) {
            schema = https;
        }
        let finished = false;
        const request = schema
            .get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                finished = true;
                resolve(true);
            });
        })
            .on('error', function (err) {
            fs.unlinkSync(path);
            finished = true;
            reject(err);
        });
        setTimeout(() => {
            if (!finished) {
                request.destroy();
                reject(new Error(`Timeout ${url}`));
            }
        }, timeout_seg * 1000);
    });
};
exports.downloadFile = downloadFile;
const shaHashMaker = (str) => crypto.createHash('sha1').update(str).digest('hex');
exports.shaHashMaker = shaHashMaker;
const defaultDclIgnore = () => [
    '.*',
    'package.json',
    'package-lock.json',
    'yarn-lock.json',
    'build.json',
    'export',
    'tsconfig.json',
    'tslint.json',
    'node_modules',
    '*.ts',
    '*.tsx',
    'Dockerfile',
    'dist',
    'README.md',
    '*.blend',
    '*.fbx',
    '*.zip',
    '*.rar'
].join('\n');
exports.defaultDclIgnore = defaultDclIgnore;
const getDirectories = (source) => {
    if (!fs.existsSync(source))
        return [];
    return fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
};
exports.getDirectories = getDirectories;
const createStaticRoutes = (app, route, localFolder, mapFile) => {
    app.use(route, (req, res, next) => {
        const options = {
            root: localFolder,
            dotfiles: 'deny',
            maxAge: 1,
            cacheControl: false,
            lastModified: true,
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
                etag: JSON.stringify(Date.now().toString()),
                'cache-control': 'no-cache,private,max-age=1'
            }
        };
        const fileName = mapFile ? mapFile(req.params[0]) : req.params[0];
        res.sendFile(fileName, options, (err) => {
            if (err) {
                next(err);
            }
        });
    });
};
exports.createStaticRoutes = createStaticRoutes;
