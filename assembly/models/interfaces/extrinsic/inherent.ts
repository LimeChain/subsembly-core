import { Codec } from "as-scale-codec";

/**
 * @description Interface for Inherent model
 */
export interface IInherent{
    /**
     * @description Get call index of the Inherent object
     */
    getCallIndex(): u8[];
    /**
     * @description Get Module prefix of the Inherent object
     */
    getPrefix(): u8;
    /**
     * @description Get API version of the Inherent object
     */
    getVersion(): u8;
    /**
     * @description Get the argument value of the Inherent object
     */
    getArgument(): Codec;
}