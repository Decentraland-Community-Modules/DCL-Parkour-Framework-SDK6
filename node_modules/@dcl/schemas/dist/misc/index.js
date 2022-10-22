"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFSv1 = exports.IPFSv2 = exports.EthAddress = exports.Color3 = void 0;
const validation_1 = require("../validation");
/**
 * Color3
 * @alpha
 */
var Color3;
(function (Color3) {
    Color3.schema = {
        type: 'object',
        required: ['r', 'g', 'b'],
        properties: {
            r: {
                type: 'number',
                minimum: 0,
                maximum: 1
            },
            g: {
                type: 'number',
                minimum: 0,
                maximum: 1
            },
            b: {
                type: 'number',
                minimum: 0,
                maximum: 1
            }
        }
    };
    const schemaValidator = (0, validation_1.generateLazyValidator)(Color3.schema);
    Color3.validate = (color) => schemaValidator(color);
})(Color3 = exports.Color3 || (exports.Color3 = {}));
/**
 * EthAddress
 * @alpha
 */
var EthAddress;
(function (EthAddress) {
    EthAddress.schema = {
        type: 'string',
        pattern: '^0x[a-fA-F0-9]{40}$'
    };
    const regexp = new RegExp(EthAddress.schema.pattern);
    EthAddress.validate = (ethAddress) => regexp.test(ethAddress);
})(EthAddress = exports.EthAddress || (exports.EthAddress = {}));
/**
 * IPFSv2
 * @public
 */
var IPFSv2;
(function (IPFSv2) {
    IPFSv2.schema = {
        type: 'string',
        pattern: '^(ba)[a-zA-Z0-9]{57}$'
    };
    const regexp = new RegExp(IPFSv2.schema.pattern);
    IPFSv2.validate = (hash) => regexp.test(hash);
})(IPFSv2 = exports.IPFSv2 || (exports.IPFSv2 = {}));
/**
 * IPFSv1
 * @public
 */
var IPFSv1;
(function (IPFSv1) {
    IPFSv1.schema = {
        type: 'string',
        pattern: '^(Qm)[a-zA-Z0-9]{44}$'
    };
    const regexp = new RegExp(IPFSv1.schema.pattern);
    IPFSv1.validate = (hash) => regexp.test(hash);
})(IPFSv1 = exports.IPFSv1 || (exports.IPFSv1 = {}));
//# sourceMappingURL=index.js.map