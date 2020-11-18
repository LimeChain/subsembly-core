import { Codec } from "as-scale-codec";
import { IDigestItem } from "./digest-item";

/**
 * @description Interface for BaseConsensusItem
 */
export interface IBaseConsensusItem extends IDigestItem{
    /**
     * @description Unwrap the underlying value
     */
    unwrap(): Codec;
}