import { Codec } from "as-scale-codec";

/**
 * @description Interface for DigestItem
 */
export interface IDigestItem extends Codec{
    /**
     * @description Get the Type ID of the digest item
     */
    getTypeId(): i32;
}
