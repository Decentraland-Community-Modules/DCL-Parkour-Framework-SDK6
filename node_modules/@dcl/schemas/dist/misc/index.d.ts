import { JSONSchema, ValidateFunction } from '../validation';
/**
 * Color3 is a data type that describes a color using R, G and B components
 * @alpha
 */
export declare type Color3 = {
    r: number;
    g: number;
    b: number;
};
/**
 * Color3
 * @alpha
 */
export declare namespace Color3 {
    const schema: JSONSchema<Color3>;
    const validate: ValidateFunction<Color3>;
}
/**
 * @alpha
 */
export declare type WearableId = string;
/**
 * EthAddress is a data type that describes an Ethereum address
 * @alpha
 */
export declare type EthAddress = string;
/**
 * EthAddress
 * @alpha
 */
export declare namespace EthAddress {
    const schema: JSONSchema<EthAddress>;
    const validate: ValidateFunction<EthAddress>;
}
/**
 * IPFSv2 is a data type that describes an IPFS v2 hash
 * @public
 */
export declare type IPFSv2 = string;
/**
 * IPFSv2
 * @public
 */
export declare namespace IPFSv2 {
    const schema: JSONSchema<IPFSv2>;
    const validate: ValidateFunction<IPFSv2>;
}
/**
 * @public
 */
export declare type IPFSv1 = string;
/**
 * IPFSv1
 * @public
 */
export declare namespace IPFSv1 {
    const schema: JSONSchema<IPFSv1>;
    const validate: ValidateFunction<IPFSv1>;
}
//# sourceMappingURL=index.d.ts.map