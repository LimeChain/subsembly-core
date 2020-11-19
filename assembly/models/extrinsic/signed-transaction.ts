import { Bool, BytesReader, Codec, CompactInt, Hash, UInt64 } from "as-scale-codec";
import { Signature } from "..";
import { IExtrinsic, ISignedTransaction } from "../interfaces";
import { Extrinsic, ExtrinsicType } from "./extrinsic";

/**
 * @description Class representing an Extrinsic in the Substrate Runtime
 */
export class SignedTransaction extends Extrinsic implements ISignedTransaction{
    
    /**
     * from address 
     */
    public from: Hash
    
    /**
     * to address
     */
    public to: Hash

    /**
     * amount of the transfer
     */
    public amount: UInt64

    /**
     * nonce of the transaction
     */
    public nonce: UInt64

    /**
     * the signature of the transaction (64 byte array)
     */
    public signature: Signature

    /**
     * Determines whether to exhaust the gas. Default false
     */
    public exhaustResourcesWhenNotFirst: Bool

    constructor(
        from: Hash = new Hash(), 
        to: Hash = new Hash(), 
        amount: UInt64 = new UInt64(), 
        nonce: UInt64 = new UInt64(), 
        signature: Signature = new Signature(), 
        exhaustResourcesWhenNotFirst: Bool = new Bool()) 
    {
        super(ExtrinsicType.SignedTransaction);
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.nonce = nonce;
        this.signature = signature;
        this.exhaustResourcesWhenNotFirst = exhaustResourcesWhenNotFirst;
    }

    /**
    * @description SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        let len = new CompactInt(ExtrinsicType.SignedTransaction);
        return len.toU8a()
            .concat(this.from.toU8a())
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
            .concat(this.signature.value)
            .concat(this.exhaustResourcesWhenNotFirst.toU8a());
    }

    /**
     * @description Get type id of the Extrinsic
     */
    getTypeId(): i32{
        return <i32>this.typeId;
    }

    /**
     * @description get SCALE encoded bytes for the Transfer instance
     */
    getTransferBytes(): u8[]{
        return this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
    }

    /**
     * @description Get amount of transaction
     */
    getAmount(): Codec{
        return this.amount;
    }

    /**
     * @description Get nonce of the transaction
     */
    getNonce(): Codec{
        return this.nonce;
    }

    /**
     * @description Get signature of the transaction
     */
    getSignature(): Signature{
        return this.signature;
    }

    /**
     * @description Get sender of the transaction
     */
    getFrom(): Codec{
        return this.from;
    }

    /**
     * @description Get receiver of the transaction
     */
    getTo(): Codec{
        return this.to;
    }

    /**
     * @description Converts to SCALE encoded bytes
     */
    encodedLength(): i32{
        return this.toU8a().length;
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        assert(bytes.length - index > this.getTypeId(), "SignedTransaction: Bytes array with insufficient length");
        const bytesReader = new BytesReader(bytes.slice(index));
        let length = bytesReader.readInto<CompactInt>();
        assert(<i32>length.value == this.typeId, "SignedTransaction: Incorrectly encoded SignedTransaction");
        this.from = bytesReader.readInto<Hash>();
        this.to = bytesReader.readInto<Hash>();
        this.amount = bytesReader.readInto<UInt64>();
        this.nonce = bytesReader.readInto<UInt64>();
        this.signature = bytesReader.readInto<Signature>();
    }

    /**
     * @description Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     */
    static fromU8Array(input: u8[], index: i32 = 0): IExtrinsic {
        assert(input.length - index >= 144, "Extrinsic: Invalid bytes provided. EOF");

        const bytesReader = new BytesReader(input.slice(index));

        const from = bytesReader.readInto<Hash>();
        const to = bytesReader.readInto<Hash>();
        const amount = bytesReader.readInto<UInt64>();
        const nonce = bytesReader.readInto<UInt64>();
        const signature = bytesReader.readInto<Signature>();
        const exhaustResourcesWhenNotFirst = bytesReader.readInto<Bool>();

        return new SignedTransaction(from, to, amount, nonce, signature, exhaustResourcesWhenNotFirst);
    }
    
    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    @inline @operator('==')
    static eq(a: SignedTransaction, b: SignedTransaction): bool {
    return a.from == b.from 
        && a.to == b.to
        && a.amount.value == b.amount.value
        && a.nonce.value == b.nonce.value
        && a.signature == b.signature;
    }

    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    @inline @operator('!=')
    static notEq(a: SignedTransaction, b: SignedTransaction): bool {
        return !SignedTransaction.eq(a, b);
    }

}