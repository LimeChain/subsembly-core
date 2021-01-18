import { Codec } from 'as-scale-codec';
import { Utils } from '../../utils';

/**
 * @description Class representing TransactionTag to Substrate Runtime
 */
export class TransactionTag<Address extends Codec, Nonce extends Codec>{
    /**
     * fixed byte length of the transaction tag
     */
    public static readonly TAG_LEN: u8 = 36;
    /**
     * Scale encoded bytes of the sender's AccountID
     */
    public sender: Address;
    /**
     * Nonce of the transaction
     */
    public nonce: Nonce;

    constructor(sender: Address, nonce: Nonce){
        this.sender = sender;
        this.nonce = nonce;
    }

    /**
     * @description Converts to SCALE encoded bytes
     */
    toU8a(): u8[]{
        const tagU8a: u8[] = this.sender.toU8a()
            .concat(this.nonce.toU8a())
        return Utils.encodeCompact(tagU8a);
    }
}