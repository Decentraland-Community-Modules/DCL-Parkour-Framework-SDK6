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
exports.mockCatalyst = void 0;
const path = __importStar(require("path"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const setupUtils_1 = require("../setupUtils");
const wearables_1 = require("../wearables");
const mockCatalyst = (app, baseFolders) => {
    serveFolders(app, baseFolders);
    app.get('/lambdas/explore/realms', (req, res) => {
        res.json([
            {
                serverName: 'localhost',
                url: `http://${req.get('host')}`,
                layer: 'stub',
                usersCount: 0,
                maxUsers: 100,
                userParcels: []
            }
        ]);
    });
    app.get('/lambdas/contracts/servers', (req, res) => {
        res.json([
            {
                address: `http://${req.get('host')}`,
                owner: '0x0000000000000000000000000000000000000000',
                id: '0x0000000000000000000000000000000000000000000000000000000000000000'
            }
        ]);
    });
    app.get('/lambdas/profiles', async (req, res, next) => {
        try {
            const previewWearables = await (0, wearables_1.getAllPreviewWearables)({
                baseFolders,
                baseUrl: ''
            }).map((wearable) => wearable.id);
            if (previewWearables.length === 1) {
                const deployedProfile = await (await fetch(`https://peer.decentraland.org${req.originalUrl}`)).json();
                if ((deployedProfile === null || deployedProfile === void 0 ? void 0 : deployedProfile.length) === 1) {
                    deployedProfile[0].avatars[0].avatar.wearables.push(...previewWearables);
                    return res.json(deployedProfile);
                }
            }
        }
        catch (err) {
            console.warn(`Failed to catch profile and fill with preview wearables.`, err);
        }
        return next();
    });
    // fallback all lambdas to a real catalyst
    app.use('/lambdas', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'https://peer.decentraland.org/',
        changeOrigin: true,
        timeout: 25 * 1000,
        proxyTimeout: 25 * 1000,
        onError: (err, req_, res) => {
            console.warn(`Oops, it seems the catalyst isn't working well.`);
            res.writeHead(500);
            res.end('');
        }
    }));
    // fallback all lambdas to a real catalyst
    app.use('/content', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'https://peer.decentraland.org/',
        changeOrigin: true,
        timeout: 25 * 1000,
        proxyTimeout: 25 * 1000,
        onError: (err, req_, res) => {
            console.warn(`Oops, it seems the content server isn't working well.`);
            res.writeHead(500);
            res.end('');
        }
    }));
};
exports.mockCatalyst = mockCatalyst;
const serveFolders = (app, baseFolders) => {
    app.get('/content/contents/:hash', (req, res, next) => {
        if (req.params.hash && req.params.hash.startsWith('b64-')) {
            const fullPath = path.resolve(Buffer.from(req.params.hash.replace(/^b64-/, ''), 'base64').toString('utf8'));
            // only return files IF the file is within a baseFolder
            if (!baseFolders.find((folder) => fullPath.startsWith(folder))) {
                next();
                return;
            }
            const options = {
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
            res.sendFile(fullPath, options, (err) => {
                if (err) {
                    next(err);
                }
            });
        }
    });
    function pointerRequestHandler(pointers) {
        if (!pointers) {
            return [];
        }
        const requestedPointers = new Set(pointers && typeof pointers === 'string'
            ? [pointers]
            : pointers);
        const resultEntities = (0, setupUtils_1.getSceneJson)({
            baseFolders,
            pointers: Array.from(requestedPointers)
        });
        return resultEntities;
    }
    app.get('/content/entities/scene', (req, res) => {
        return res.json(pointerRequestHandler(req.query.pointer)).end();
    });
    app.post('/content/entities/active', (req, res) => {
        return res.json(pointerRequestHandler(req.body.pointers)).end();
    });
};
