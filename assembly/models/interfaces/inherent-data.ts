import { ByteArray, Codec } from "as-scale-codec";

/**
 * Interface for InherentData model
 */
export interface IInherentData extends Codec{
    /**
     * Get underlying data
     */
    getData(): Map<string, ByteArray>;
}