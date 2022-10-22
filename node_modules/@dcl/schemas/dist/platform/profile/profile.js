"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const validation_1 = require("../../validation");
const avatar_1 = require("./avatar");
/**
 * Profile
 * @alpha
 */
var Profile;
(function (Profile) {
    Profile.schema = {
        type: 'object',
        required: ['avatars'],
        properties: {
            avatars: {
                type: 'array',
                items: avatar_1.Avatar.schema
            }
        },
        additionalProperties: true
    };
    Profile.validate = (0, validation_1.generateLazyValidator)(Profile.schema);
})(Profile = exports.Profile || (exports.Profile = {}));
//# sourceMappingURL=profile.js.map