import { CompactInt, UInt64 } from 'as-scale-codec';
import { AccountId } from "..";

/**
 * @description Class representing TransactionTag to Substrate Runtime
 */
export class TransactionTag{
    /**
     * fixed byte length of the transaction tag
     */
    public static readonly TAG_LEN: u8 = 36;
    /**
     * Scale encoded bytes of the sender's AccountID
     */
    public sender: AccountId;
    /**
     * Nonce of the transaction
     */
    public nonce: UInt64;

    constructor(sender: AccountId, nonce: UInt64){
        this.sender = sender;
        this.nonce = nonce;
    }

    /**
     * @description Converts to SCALE encoded bytes
     */
    toU8a(): u8[]{
        const lenCompact = new CompactInt(TransactionTag.TAG_LEN);
        const res: u8[] = lenCompact.toU8a();
        const tagU8a: u8[] = this.sender.getAddress()
            .concat(this.nonce.toU8a())
            .slice(0, TransactionTag.TAG_LEN);
        return res.concat(tagU8a);
    }
}