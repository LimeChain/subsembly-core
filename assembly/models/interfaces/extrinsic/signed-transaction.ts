import { Codec } from "as-scale-codec";

/**
 * @description Interface for SignedTransaction
 */
export interface ISignedTransaction<Address extends Codec, A extends Codec, N extends Codec, S extends Codec>{
    /**
     * @description Get sender of the transaction
     */
    getFrom(): Address;

    /**
     * @description Get receiver of the transaction
     */
    getTo(): Address;

    /**
     * @description Get amount of transaction
     */
    getAmount(): A;

    /**
     * @description Get nonce of the transaction
     */    
    getNonce(): N;

    /**
     * @description Get signature of the transaction
     */
    getSignature(): S;

    /**
     * @description get SCALE encoded bytes for the Transfer instance
     */
    getTransferBytes(): u8[];
}