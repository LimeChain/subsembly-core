import { BytesReader, CompactInt, Hash } from "as-scale-codec";
import { DecodedData, DigestItem, Option } from ".";
import { Utils } from "../utils";
import { Constants } from "./constants";
import { IHeader } from "./interfaces/header";

/**
 * @description Class representing a Block Header into the Substrate Runtime
 */
export class Header implements IHeader{

    /**
     * 32-byte Blake hash of the header of the parent of the block
     */
    public parentHash: Hash
    /**
     * Integer, which represents the index of the current block in the chain.
     * It is equal to the number of the ancestor blocks.
     */
    public number: CompactInt
    /**
     * Root of the Merkle trie, whose leaves implement the storage of the system.
     */
    public stateRoot: Hash
    /**
     * Field reserved for the Runtime to validate the integrity of the extrinsics composing the block body.
     */
    public extrinsicsRoot: Hash
    /**
     * Field used to store any chain-specific auxiliary data, which could help the light clients interact with the block 
     * without the need of accessing the full storage as well as consensus-related data including the block signature. 
     */
    public digests: Option<DigestItem[]>

    constructor(
        parentHash: Hash = new Hash(), 
        number: CompactInt = new CompactInt(), 
        stateRoot: Hash = new Hash(), 
        extrinsicsRoot: Hash = new Hash(), 
        digests: Option<DigestItem[]> = new Option([]))
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
    getNumber(): CompactInt{
        return this.number;
    }

    /**
     * @description Get extriniscsRoot
     */
    getExtrinsicsRoot(): Hash{
        return this.extrinsicsRoot;
    }
    
    /**
     * @description Get parentHash
     */
    getParentHash(): Hash{
        return this.parentHash;
    }
    
    /**
     * @description Get stateRoot
     */
    getStateRoot(): Hash{
        return this.stateRoot;
    }
    
    /**
     * @description Get list of digests
     */
    getDigests(): DigestItem[]{
        return <DigestItem[]>this.digests.unwrap();
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
        this.parentHash = bytesReader.readInto<Hash>();
        this.number = bytesReader.readInto<CompactInt>();
        this.stateRoot = bytesReader.readInto<Hash>();
        this.extrinsicsRoot = bytesReader.readInto<Hash>();
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
     * @description Instanciates new Header object from SCALE encoded byte array
     * @param input - SCALE encoded Header
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<IHeader> {
        const bytesReader = new BytesReader(input.slice(index));

        const parentHash = bytesReader.readInto<Hash>();
        const number = bytesReader.readInto<CompactInt>();
        const stateRoot = bytesReader.readInto<Hash>();
        const extrinsicsRoot = bytesReader.readInto<Hash>();

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

    /**
     * Overloaded == operator
     * @param a 
     * @param b 
     */
    @inline @operator('==')
    static eq(a: Header, b: Header): bool {
        let areEqual = a.parentHash == b.parentHash
            && a.number == b.number
            && a.stateRoot == b.stateRoot
            && a.extrinsicsRoot == b.extrinsicsRoot;

        if (a.digests.isSome() && b.digests.isSome()) {
            return areEqual && Utils.areArraysEqual(<DigestItem[]>a.digests.unwrap(), <DigestItem[]>b.digests.unwrap());
        } else if (!a.digests.isSome() && !b.digests.isSome()) {
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
    @inline @operator('!=')
    static notEq(a: Header, b: Header): bool {
        return !Header.eq(a, b);
    }
}