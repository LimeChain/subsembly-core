import { ByteArray, Codec } from "as-scale-codec";

/**
 * @description Interface for InherentData model
 */
export interface IInherentData extends Codec{
    /**
     * @description Get underlying data
     */
    getData(): Map<string, ByteArray>;
}