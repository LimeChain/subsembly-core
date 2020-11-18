import { Codec } from "as-scale-codec";

/**
 * @description Interface for SignedTransaction
 */
export interface ISignedTransaction{
    /**
     * @description Get sender of the transaction
     */
    getFrom(): Codec;

    /**
     * @description Get receiver of the transaction
     */
    getTo(): Codec;

    /**
     * @description Get amount of transaction
     */
    getAmount(): Codec;

    /**
     * @description Get nonce of the transaction
     */    
    getNonce(): Codec;

    /**
     * @description Get signature of the transaction
     */
    getSignature(): Codec;

    /**
     * @description get SCALE encoded bytes for the Transfer instance
     */
    getTransferBytes(): u8[];
}