import { Codec } from "as-scale-codec";

/**
 * @description Interface for base Extrinsic model
 */
export interface IExtrinsic extends Codec{
    /**
     * @description Get Type ID of the Extrinsic
     */
    getTypeId(): i32;
}