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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const setupUtils_1 = require("./cli/setupUtils");
const mock_catalyst_1 = require("./cli/mock-catalyst");
const wearables_1 = require("./cli/wearables");
const schemas_1 = require("@dcl/schemas");
const setupProxy = (dcl, app) => {
    // first resolve all dependencies in the local current working directory
    // second try to resolve dependencies in decentraland-ecs folder
    /**
     * to test locally with linked packages:
     *
     * 1. go to explorer/kernel/static and run `npm link`
     * 2. in an empty folder create a test scene with `dcl init`
     * 3. in that folder run `npm install folder-to/decentraland-ecs`
     * 4. install whatever version of `@dcl/unity-renderer` you want to test
     * 5. link kernel using `npm link @dcll/kernel` this will use the folder from step 1
     */
    const ecsPath = path.dirname(require.resolve('decentraland-ecs/package.json', {
        paths: [dcl.getWorkingDir(), __dirname + '/../../', __dirname + '/../']
    }));
    const dclKernelPath = path.dirname(require.resolve('@dcl/kernel/package.json', {
        paths: [dcl.getWorkingDir(), ecsPath]
    }));
    const dclKernelDefaultProfilePath = path.resolve(dclKernelPath, 'default-profile');
    const dclKernelImagesDecentralandConnect = path.resolve(dclKernelPath, 'images', 'decentraland-connect');
    const dclKernelLoaderPath = path.resolve(dclKernelPath, 'loader');
    const dclUnityRenderer = path.dirname(require.resolve('@dcl/unity-renderer/package.json', {
        paths: [dcl.getWorkingDir(), ecsPath]
    }));
    let baseSceneFolders = [dcl.getWorkingDir()];
    let baseWearableFolders = [dcl.getWorkingDir()];
    // TODO: merge types from github.com/decentraland/cli
    if (dcl.workspace) {
        const projects = dcl.workspace.getAllProjects();
        if (!!(projects === null || projects === void 0 ? void 0 : projects.length)) {
            const { wearables, scenes } = projects.reduce((acc, project) => {
                const projectType = project.getInfo().sceneType;
                const projectDir = project.getProjectWorkingDir();
                if (projectType === schemas_1.sdk.ProjectType.SCENE)
                    acc.scenes.push(projectDir);
                if (projectType === schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE)
                    acc.wearables.push(projectDir);
                return acc;
            }, { wearables: [], scenes: [] });
            baseSceneFolders = scenes;
            baseWearableFolders = wearables;
        }
    }
    try {
        (0, mock_catalyst_1.mockCatalyst)(app, [...baseSceneFolders, ...baseWearableFolders]);
    }
    catch (err) {
        console.error(`Fatal error, couldn't mock the catalyst`, err);
    }
    try {
        (0, wearables_1.mockPreviewWearables)(app, baseWearableFolders);
    }
    catch (err) {
        console.error(`Fatal error, couldn't mock the wearables`, err);
    }
    const routes = [
        {
            route: '/',
            path: path.resolve(dclKernelPath, 'preview.html'),
            type: 'text/html'
        },
        {
            route: '/favicon.ico',
            path: path.resolve(dclKernelPath, 'favicon.ico'),
            type: 'text/html'
        },
        {
            route: '/@/artifacts/index.js',
            path: path.resolve(dclKernelPath, 'index.js'),
            type: 'text/javascript'
        }
    ];
    for (const route of routes) {
        app.get(route.route, async (req, res) => {
            res.setHeader('Content-Type', route.type);
            const contentFile = fs.readFileSync(route.path);
            res.send(contentFile);
        });
    }
    (0, setupUtils_1.createStaticRoutes)(app, '/images/decentraland-connect/*', dclKernelImagesDecentralandConnect);
    (0, setupUtils_1.createStaticRoutes)(app, '/@/artifacts/unity-renderer/*', dclUnityRenderer, (filePath) => filePath.replace(/.br+$/, ''));
    (0, setupUtils_1.createStaticRoutes)(app, '/@/artifacts/loader/*', dclKernelLoaderPath);
    (0, setupUtils_1.createStaticRoutes)(app, '/default-profile/*', dclKernelDefaultProfilePath);
    app.get('/feature-flags/:file', async (req, res) => {
        const featureFlagResponse = await fetch(`https://feature-flags.decentraland.zone/${req.params.file}`);
        const featureFlagBody = await featureFlagResponse.json();
        return res.json(featureFlagBody);
    });
};
module.exports = setupProxy;
