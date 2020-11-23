import { BytesReader, Codec, CompactInt } from "as-scale-codec";
import { DecodedData, DigestItem, Option } from ".";
import { Utils } from "../utils";
import { Constants } from "./constants";

/**
 * @description Class representing a Block Header into the Substrate Runtime
 */
export class Header<N extends Codec, H extends Codec> implements Codec{

    /**
     * 32-byte Blake hash of the header of the parent of the block
     */
    public parentHash: H
    /**
     * Integer, which represents the index of the current block in the chain.
     * It is equal to the number of the ancestor blocks.
     */
    public number: N
    /**
     * Root of the Merkle trie, whose leaves implement the storage of the system.
     */
    public stateRoot: H
    /**
     * Field reserved for the Runtime to validate the integrity of the extrinsics composing the block body.
     */
    public extrinsicsRoot: H
    /**
     * Field used to store any chain-specific auxiliary data, which could help the light clients interact with the block 
     * without the need of accessing the full storage as well as consensus-related data including the block signature. 
     */
    public digests: Option<DigestItem[]>

    constructor(
        parentHash: H = instantiate<H>(), 
        number: N = instantiate<N>(), 
        stateRoot: H = instantiate<H>(), 
        extrinsicsRoot: H = instantiate<H>(), 
        digests: Option<DigestItem[]> = new Option())
    {
        this.parentHash = parentHash;
        this.number = number;
        this.stateRoot = stateRoot;
        this.extrinsicsRoot = extrinsicsRoot;
        this.digests = digests;
    }

    /**
     * @description Get block number
     */
    getNumber(): N{
        return this.number;
    }

    /**
     * @description Get extriniscsRoot
     */
    getExtrinsicsRoot(): H{
        return this.extrinsicsRoot;
    }
    
    /**
     * @description Get parentHash
     */
    getParentHash(): H{
        return this.parentHash;
    }
    
    /**
     * @description Get stateRoot
     */
    getStateRoot(): H{
        return this.stateRoot;
    }
    
    /**
     * @description Get list of digests
     */
    getDigests(): DigestItem[]{
        if(this.digests.isSome()){
            return <DigestItem[]>this.digests.unwrap();
        }
        return [];
    }    
    /**
     * @description Encoded length of the header
     */
    encodedLength(): i32{
        return this.stateRoot.encodedLength() + this.parentHash.encodedLength() 
            + 0 + this.extrinsicsRoot.encodedLength()
            + this.number.encodedLength();
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        const bytesReader = new BytesReader(bytes.slice(index));
        this.parentHash = bytesReader.readInto<H>();
        this.number = bytesReader.readInto<N>();
        this.stateRoot = bytesReader.readInto<H>();
        this.extrinsicsRoot = bytesReader.readInto<H>();
        this.digests = Header.decodeOptionalDigest(bytesReader.getLeftoverBytes()).getResult();
    }

    /**
    * @description SCALE Encodes the Header into u8[]
    */
    toU8a(): u8[] {
        let digest:u8[] = [];
        if (this.digests.isSome()) {
            let digestItemArray = <DigestItem[]>this.digests.unwrap();
            const length = new CompactInt(digestItemArray.length);
            digest = digest.concat(length.toU8a());
            
            for (let i = 0; i < length.value; i++){
                digest = digest.concat(digestItemArray[i].toU8a());
            }
        } else {
            digest = Constants.EMPTY_BYTE_ARRAY;
        }

        return this.parentHash.toU8a()
            .concat(this.number.toU8a())
            .concat(this.stateRoot.toU8a())
            .concat(this.extrinsicsRoot.toU8a())
            .concat(digest);
    }

    /**
     * Overloaded == operator
     * @param a 
     * @param b 
     */
    eq(other: Header<N, H>): bool {
        let areEqual = this.parentHash == other.parentHash
            && this.number == other.number
            && this.stateRoot == other.stateRoot
            && this.extrinsicsRoot == other.extrinsicsRoot;

        if (this.digests.isSome() && other.digests.isSome()) {
            return areEqual && Utils.areArraysEqual(<DigestItem[]>this.digests.unwrap(), <DigestItem[]>other.digests.unwrap());
        } else if (!this.digests.isSome() && !other.digests.isSome()) {
            return areEqual;
        }else {
            return false;
        }
    }

    /**
     * Overloaded != operator
     * @param a 
     * @param b 
     */
    notEq(other: Header<N, H>): bool {
        return !this.eq(other);
    }

    /**
     * @description Instanciates new Header object from SCALE encoded byte array
     * @param input - SCALE encoded Header
     */
    static fromU8Array<N extends Codec, H extends Codec>(input: u8[], index: i32 = 0): DecodedData<Header<N, H>> {
        const bytesReader = new BytesReader(input.slice(index));

        const parentHash = bytesReader.readInto<H>();
        const number = bytesReader.readInto<N>();
        const stateRoot = bytesReader.readInto<H>();
        const extrinsicsRoot = bytesReader.readInto<H>();

        const digest = this.decodeOptionalDigest(bytesReader.getLeftoverBytes());
        
        const result = new Header(parentHash, number, stateRoot, extrinsicsRoot, digest.result);
        return new DecodedData(result, digest.input);
    }

    /**
     * @description Decodes the byte array into Optional Hash and slices it depending on the decoding
     * TODO - move this function to a proper place
     * @param input - SCALE Encded byte array
     */
    private static decodeOptionalDigest(input: u8[]): DecodedData<Option<DigestItem[]>> {
        let digestOption = new Option<DigestItem[]>(null);
        if (Option.isArraySomething(input)) {
            let itemsLength = CompactInt.fromU8a(input);
            input = input.slice(itemsLength.encodedLength());
            digestOption = new Option<DigestItem[]>(new Array<DigestItem>());
            
            for (let i = 0; i < itemsLength.value; i++) {
                let decodedItem = DigestItem.fromU8Array(input);
                (<DigestItem[]>digestOption.unwrap()).push(decodedItem.result);
                input = decodedItem.input;
            }
        } else {
            input = input.slice(1);
        }
        return new DecodedData<Option<DigestItem[]>>(digestOption, input);
    }
}