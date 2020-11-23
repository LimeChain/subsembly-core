import { Bool, BytesReader, Codec, CompactInt } from "as-scale-codec";
import { Extrinsic, ExtrinsicType } from "./extrinsic";

/**
 * @description Class representing an Extrinsic in the Substrate Runtime
 */
export class SignedTransaction<Address extends Codec, A extends Codec, N extends Codec, S extends Codec> 
    extends Extrinsic{
    
    /**
     * from address 
     */
    public from: Address
    
    /**
     * to address
     */
    public to: Address

    /**
     * amount of the transfer
     */
    public amount: A

    /**
     * nonce of the transaction
     */
    public nonce: N

    /**
     * the signature of the transaction (64 byte array)
     */
    public signature: S;

    /**
     * Determines whether to exhaust the gas. Default false
     */
    public exhaustResourcesWhenNotFirst: Bool

    constructor(
        from: Address = instantiate<Address>(), 
        to: Address = instantiate<Address>(), 
        amount: A = instantiate<A>(), 
        nonce: N = instantiate<N>(), 
        signature: S = instantiate<S>(), 
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
            .concat(this.signature.toU8a())
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
    getAmount(): A{
        return this.amount;
    }

    /**
     * @description Get nonce of the transaction
     */
    getNonce(): N{
        return this.nonce;
    }

    /**
     * @description Get signature of the transaction
     */
    getSignature(): S{
        return this.signature;
    }

    /**
     * @description Get sender of the transaction
     */
    getFrom(): Address{
        return this.from;
    }

    /**
     * @description Get receiver of the transaction
     */
    getTo(): Address{
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

        this.from = bytesReader.readInto<Address>();
        this.to = bytesReader.readInto<Address>();
        this.amount = bytesReader.readInto<A>();
        this.nonce = bytesReader.readInto<N>();
        this.signature = bytesReader.readInto<S>();
    }

    /**
     * @description Instanciates new Extrinsic object from SCALE encoded byte array
     * @param input - SCALE encoded Extrinsic
     */
    static fromU8Array<Address extends Codec, A extends Codec, N extends Codec, S extends Codec>(input: u8[], index: i32 = 0): Extrinsic {
        assert(input.length - index >= ExtrinsicType.SignedTransaction, "Extrinsic: Invalid bytes provided. EOF");

        const bytesReader = new BytesReader(input.slice(index));

        const from = bytesReader.readInto<Address>();
        const to = bytesReader.readInto<Address>();
        const amount = bytesReader.readInto<A>();
        const nonce = bytesReader.readInto<N>();
        const signature = bytesReader.readInto<S>();
        const exhaustResourcesWhenNotFirst = bytesReader.readInto<Bool>();

        return new SignedTransaction(from, to, amount, nonce, signature, exhaustResourcesWhenNotFirst);
    }

}