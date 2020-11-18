import { Codec } from "as-scale-codec";

/**
 * @description Interface for Signature
 */
export interface ISignature extends Codec{
    /**
     * @description Get underlying value of instance
     */
    getValue(): u8[];
}