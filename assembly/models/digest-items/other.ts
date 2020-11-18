import { ByteArray, BytesReader } from "as-scale-codec";
import { DigestItem, DigestItemType } from ".";
import { DecodedData } from "..";

/**
 * @description Class representing Other Digest Item into the Substrate Runtime
 */
export class Other extends DigestItem {

    /**
     * Digest Item Payload
     */
    public value: ByteArray

    constructor(value: ByteArray = new ByteArray()) {
        super(DigestItemType.Other);
        this.value = value;
    }
    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        this.value = BytesReader.decodeInto<ByteArray>(bytes.slice(index));
    }
    /**
     * @description Instanciates Other DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<DigestItem> {
        const bytesReader = new BytesReader(input.slice(index));
        const value = bytesReader.readInto<ByteArray>();
        return new DecodedData<DigestItem>(new Other(value), bytesReader.getLeftoverBytes());
    }

    /**
     * @description Encoded byte length of the instance
     */
    encodedLength(): i32{
        return this.value.encodedLength() + 1;
    }
    /**
     * @description SCALE Encodes the Other DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.Other];
        return encoded.concat(this.value.toU8a());
    }

    /**
     * @description Checks whether the value passed is equal to this instance
     * @param other 
     */
    equals(other: Other): bool {
        return this.value == other.value;
    }

}