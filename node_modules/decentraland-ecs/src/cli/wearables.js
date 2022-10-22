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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPreviewWearables = exports.getAllPreviewWearables = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const setupUtils_1 = require("./setupUtils");
const sdk_1 = require("@dcl/schemas/dist/sdk");
const serveWearable = ({ wearableJsonPath, baseUrl }) => {
    var _a;
    const wearableDir = path.dirname(wearableJsonPath);
    const wearableJson = JSON.parse(fs.readFileSync(wearableJsonPath).toString());
    if (!sdk_1.WearableJson.validate(wearableJson)) {
        const errors = (sdk_1.WearableJson.validate.errors || [])
            .map((a) => `${a.data} ${a.message}`)
            .join('');
        console.error(`Unable to validate wearable.json properly, please check it.`, errors);
        throw new Error(`Invalid wearable.json (${wearableJsonPath})`);
    }
    const dclIgnorePath = path.resolve(wearableDir, '.dclignore');
    let ignoreFileContent = '';
    if (fs.existsSync(dclIgnorePath)) {
        ignoreFileContent = fs.readFileSync(path.resolve(wearableDir, '.dclignore'), 'utf-8');
    }
    const hashedFiles = (0, setupUtils_1.getFilesFromFolder)({
        folder: wearableDir,
        addOriginalPath: false,
        ignorePattern: ignoreFileContent
    });
    const thumbnailFiltered = hashedFiles.filter(($) => ($ === null || $ === void 0 ? void 0 : $.file) === 'thumbnail.png');
    const thumbnail = thumbnailFiltered.length > 0 &&
        ((_a = thumbnailFiltered[0]) === null || _a === void 0 ? void 0 : _a.hash) &&
        `${baseUrl}/${thumbnailFiltered[0].hash}`;
    const wearableId = '8dc2d7ad-97e3-44d0-ba89-e8305d795a6a';
    const representations = wearableJson.data.representations.map((representation) => (Object.assign(Object.assign({}, representation), { mainFile: `male/${representation.mainFile}`, contents: hashedFiles.map(($) => ({
            key: `male/${$ === null || $ === void 0 ? void 0 : $.file}`,
            url: `${baseUrl}/${$ === null || $ === void 0 ? void 0 : $.hash}`
        })) })));
    return {
        id: wearableId,
        rarity: wearableJson.rarity,
        i18n: [{ code: 'en', text: wearableJson.name }],
        description: wearableJson.description,
        thumbnail: thumbnail || '',
        baseUrl,
        name: wearableJson.name || '',
        data: {
            category: wearableJson.data.category,
            replaces: [],
            hides: [],
            tags: [],
            scene: hashedFiles,
            representations: representations
        }
    };
};
const getAllPreviewWearables = ({ baseFolders, baseUrl }) => {
    const wearablePathArray = [];
    for (const wearableDir of baseFolders) {
        const wearableJsonPath = path.resolve(wearableDir, 'wearable.json');
        if (fs.existsSync(wearableJsonPath)) {
            wearablePathArray.push(wearableJsonPath);
        }
    }
    const ret = [];
    for (const wearableJsonPath of wearablePathArray) {
        try {
            ret.push(serveWearable({ wearableJsonPath, baseUrl }));
        }
        catch (err) {
            console.error(`Couldn't mock the wearable ${wearableJsonPath}. Please verify the correct format and scheme.`, err);
        }
    }
    return ret;
};
exports.getAllPreviewWearables = getAllPreviewWearables;
const mockPreviewWearables = (app, baseFolders) => {
    app.use('/preview-wearables/:id', async (req, res) => {
        const baseUrl = `${req.protocol}://${req.get('host')}/content/contents`;
        const wearables = (0, exports.getAllPreviewWearables)({
            baseUrl,
            baseFolders
        });
        const wearableId = req.params.id;
        return res.json({
            ok: true,
            data: wearables.filter((w) => (w === null || w === void 0 ? void 0 : w.name.toLowerCase().replace(' ', '-')) === wearableId)
        });
    });
    app.use('/preview-wearables', async (req, res) => {
        const baseUrl = `${req.protocol}://${req.get('host')}/content/contents`;
        return res.json({
            ok: true,
            data: (0, exports.getAllPreviewWearables)({ baseUrl, baseFolders })
        });
    });
};
exports.mockPreviewWearables = mockPreviewWearables;
