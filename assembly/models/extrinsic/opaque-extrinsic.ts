import { Bool, Byte, ByteArray, BytesReader, CompactInt, UnwrappableCodec } from "as-scale-codec";
import { Utils } from "../../utils";

export class OpaqueExtrinsic implements UnwrappableCodec<ByteArray> {
    private apiVersion: u8;
    private modIndex: u8;
    private callIndex: u8;
    private payload: ByteArray;
    private isSigned: Bool;

    constructor(modIndex: u8 = 0, callIndex: u8 = 0, isSigned: Bool = new Bool(false), payload: ByteArray = new ByteArray()){
        this.modIndex = modIndex;
        this.callIndex = callIndex;
        this.isSigned = isSigned;
        this.payload = payload;
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const _len = bytesReader.readInto<CompactInt>();
        this.apiVersion = bytesReader.readInto<Byte>().unwrap();
        this.modIndex = bytesReader.readInto<Byte>().unwrap();
        this.callIndex = bytesReader.readInto<Byte>().unwrap();
        this.payload = bytesReader.readInto<ByteArray>();
    }

    /**
     * Checks if an instance is equal with other instance
     * @param other other instance     
    */
    eq(other: OpaqueExtrinsic): bool {
        return this.apiVersion == other.apiVersion
            && this.modIndex == other.modIndex 
            && this.callIndex == other.callIndex
            && this.payload.eq(other.payload)
    }

    /**
     * Checks if an instance is not equal with other instance
     * @param other other instance
     */
    notEq(other: OpaqueExtrinsic): bool {
        return !this.eq(other);
    }

    /**
     * @description Unwraps the inner value of the OpaqueExtrinsic
     */
    unwrap(): ByteArray {
        return this.payload;
    }

    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specification
     */
    toU8a(): u8[] {
        const res: u8[] = [this.apiVersion, this.modIndex, this.callIndex];
        return Utils.encodeCompact(res.concat(this.payload.toU8a()));
    }

    /**
     * @description Get byte encoded length of the OpaqueExtrinsic
     */
    encodedLength(): i32 {
        return Utils.getEncodedLen(3 + this.payload.encodedLength());
    }
}