import { BytesReader } from "as-scale-codec";
import { ISignature } from "./interfaces";

/**
 * Class representing a Signature in the Substrate Runtime
 */
export class Signature implements ISignature {

    /**
     * Length of the bytes of a signature
     */
    public static readonly SIGNATURE_LENGTH:i32 = 64;

    /**
     * Array of the signature bytes
     */
    public value: u8[];

    constructor(input: u8[] = []) {
        assert(input.length >= Signature.SIGNATURE_LENGTH, "Signature: input value must be atleast 64 bytes. EOF");
        this.value = new Array<u8>();
        this.value = this.value.concat(input);
    }

    toU8a(): u8[]{
        return this.value;
    }

    getValue(): u8[]{
        return this.value;
    }
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
    @inline @operator('==')
    static eq(a: Signature, b: Signature): bool {
        let areEqual = true;
        for (let i = 0; i < Signature.SIGNATURE_LENGTH; i++) {
            if (a.value[i] != b.value[i]) {
                areEqual = false;
                break;
            }
        }
        return areEqual;
    }

    toString(): string {
        return this.value.toString();
    }

}