import { Hash, UInt64, BIT_LENGTH, Bool, CompactInt, Codec, BytesReader } from "as-scale-codec";
import { Signature, DecodedData } from "..";
import { IExtrinsic, ISignedTransaction } from "../interfaces";
import { Extrinsic, ExtrinsicType } from "./extrinsic";

/**
 * Class representing an Extrinsic in the Substrate Runtime
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
    * SCALE Encodes the Header into u8[]
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
     * Get type id of the Extrinsic
     */
    getTypeId(): i32{
        return <i32>this.typeId;
    }

    /**
     * get SCALE encoded bytes for the Transfer instance
     */
    getTransferBytes(): u8[]{
        return this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a())
    }
    getAmount(): Codec{
        return this.amount;
    }

    getNonce(): Codec{
        return this.nonce;
    }

    getSignature(): Signature{
        return this.signature;
    }

    getFrom(): Codec{
        return this.from;
    }

    getTo(): Codec{
        return this.to;
    }

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
     * Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[]): DecodedData<IExtrinsic> {
        assert(input.length >= 144, "Extrinsic: Invalid bytes provided. EOF");

        const from = Hash.fromU8a(input);
        input = input.slice(from.encodedLength());

        const to = Hash.fromU8a(input);
        input = input.slice(to.encodedLength());

        const amount = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(amount.encodedLength());

        const nonce = UInt64.fromU8a(input.slice(0, BIT_LENGTH.INT_64));
        input = input.slice(nonce.encodedLength());

        const signature = new Signature(input.slice(0, Signature.SIGNATURE_LENGTH));
        input = input.slice(signature.value.length);

        const exhaustResourcesWhenNotFirst = Bool.fromU8a(input.slice(0, 1));
        input = input.slice(exhaustResourcesWhenNotFirst.encodedLength());

        const extrinsic = new SignedTransaction(from, to, amount, nonce, signature, exhaustResourcesWhenNotFirst);

        return new DecodedData(extrinsic, input);
    }

    @inline @operator('==')
    static eq(a: SignedTransaction, b: SignedTransaction): bool {
        let equal = 
            a.from == b.from 
            && a.to == b.to
            && a.amount.value == b.amount.value
            && a.nonce.value == b.nonce.value
            && a.signature == b.signature;
        return equal;
    }

    @inline @operator('!=')
    static notEq(a: SignedTransaction, b: SignedTransaction): bool {
        return !SignedTransaction.eq(a, b);
    }

}