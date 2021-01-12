import { BytesReader, Codec, CompactInt } from "as-scale-codec";
import { Utils } from "../../utils";

/**
 * @description Class representing a Transfer in the Substrate Runtime
 */
export class Transfer<Address extends Codec, A extends Codec, N extends Codec> 
    implements Codec {
    
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

    constructor(
        from: Address = instantiate<Address>(), 
        to: Address = instantiate<Address>(), 
        amount: A = instantiate<A>(), 
        nonce: N = instantiate<N>()) 
    {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.nonce = nonce;
    }

    /**
    * @description SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        const result: u8[] = this.from.toU8a()
            .concat(this.to.toU8a())
            .concat(this.amount.toU8a())
            .concat(this.nonce.toU8a());
        return Utils.encodeCompact(result);
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
     * @description Gets bytes length of the instance
     */
    encodedLength(): i32{
        return this.toU8a().length;
    }

    /**
     * @description Checks if this instance is equal to other instance
     * @param other 
     */
    eq(other: Transfer<Address, A, N>): bool{
        return this.from.eq(other.from) 
            && this.to.eq(other.to)
            && this.amount.eq(other.amount)
            && this.nonce.eq(other.nonce);
    }

    /**
     * @description Checks if this instance is not equal to other instance
     * @param other 
     */
    notEq(other: Transfer<Address, A, N>): bool{
        return !this.eq(other);
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        let _length = bytesReader.readInto<CompactInt>();

        this.from = bytesReader.readInto<Address>();
        this.to = bytesReader.readInto<Address>();
        this.amount = bytesReader.readInto<A>();
        this.nonce = bytesReader.readInto<N>();
    }

    /**
     * @description Instanciates new Transfer object from SCALE encoded byte array
     * @param input - SCALE encoded Transfer
     */
    static fromU8Array<Address extends Codec, A extends Codec, N extends Codec>(input: u8[], index: i32 = 0): Transfer<Address, A, N> {
        const bytesReader = new BytesReader(input.slice(index));

        let _length = bytesReader.readInto<CompactInt>();
        const from = bytesReader.readInto<Address>();
        const to = bytesReader.readInto<Address>();
        const amount = bytesReader.readInto<A>();
        const nonce = bytesReader.readInto<N>();

        return new Transfer(from, to, amount, nonce);
    }

}