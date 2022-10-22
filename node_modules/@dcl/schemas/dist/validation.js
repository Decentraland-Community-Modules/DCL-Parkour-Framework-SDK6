"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateType = exports.generateLazyValidator = exports.Ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
exports.Ajv = ajv_1.default;
const ajv_keywords_1 = __importDefault(require("ajv-keywords"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
/**
 * Generates a validator for a specific JSON schema of a type T
 * @public
 */
function generateLazyValidator(schema, keywordDefinitions) {
    let validateFn = null;
    const theReturnedValidateFunction = (data, dataCxt) => {
        if (!validateFn) {
            const ajv = new ajv_1.default({ $data: true, allErrors: true });
            (0, ajv_keywords_1.default)(ajv);
            (0, ajv_errors_1.default)(ajv, { singleError: true });
            keywordDefinitions === null || keywordDefinitions === void 0 ? void 0 : keywordDefinitions.forEach((kw) => ajv.addKeyword(kw));
            validateFn = ajv.compile(schema);
            Object.defineProperty(theReturnedValidateFunction, 'errors', {
                get() {
                    return validateFn === null || validateFn === void 0 ? void 0 : validateFn.errors;
                }
            });
        }
        return validateFn(data, dataCxt);
    };
    return theReturnedValidateFunction;
}
exports.generateLazyValidator = generateLazyValidator;
/**
 * Validates a type with a schema in a functional way.
 * @public
 */
function validateType(theType, value) {
    return theType.validate(value);
}
exports.validateType = validateType;
//# sourceMappingURL=validation.js.map