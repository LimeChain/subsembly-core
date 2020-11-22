import { Codec } from "as-scale-codec";

/**
 * @description Interface representing AccountData model
 */

export interface IAccountData extends Codec {
    /**
     * @description Sets new free value
     * @param newFree 
     */
    setFree(newFree: Codec): void;

    /**
     * @description Sets new reserved value
     * @param newReserved
     */
    setReserved(newReserved: Codec): void;

    /**
     * @description Returns the free value
     */
    getFree(): Codec;

    /**
     * @description Returns the reserved value
     */
    getReserved(): Codec;
}