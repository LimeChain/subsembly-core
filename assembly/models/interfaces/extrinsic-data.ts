import { Codec } from "as-scale-codec";

/**
 * @description Interface for ExtrinsicData model
 */
export interface IExtrinsicData extends Codec{
    /**
     * Get underlying data
     */
    getData(): Map<Codec, Codec>;
}