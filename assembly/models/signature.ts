import { BytesReader, Codec } from "as-scale-codec";
import { Utils } from "../utils";

/**
 * @description Class representing a Signature in the Substrate Runtime
 */
export class Signature implements Codec {
    /**
     * Length of the bytes of a signature
     */
    public static readonly SIGNATURE_LENGTH:i32 = 64;

    /**
     * Array of the signature bytes
     */
    public value: u8[];

    constructor(input: u8[] = []) {
        this.value = new Array<u8>();
        this.value = this.value.concat(input);
    }

    /**
     * @description Converts to SCALE encoded bytes
     */
    toU8a(): u8[]{
        return this.value;
    }

    /**
     * @description Get value of the instance
     */
    getValue(): u8[]{
        return this.value;
    }

    /**
     * @description Encoded byte length of the instance
     */
    encodedLength(): i32{
        return Signature.SIGNATURE_LENGTH;
    }
    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        assert(bytes.length - index > Signature.SIGNATURE_LENGTH, "Signature: Bytes array with insufficient length")
        const bytesReader = new BytesReader(bytes.slice(index));
        this.value = bytesReader.readBytes(Signature.SIGNATURE_LENGTH);
    }

    /**
     * @description Returns string representation
     */
    toString(): string {
        return this.value.toString();
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    eq(other: Signature): bool {
        return Utils.areArraysEqual(this.value, other.value);
    }

    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    notEq(other: Signature): bool{
        return !this.eq(other)
    }
}