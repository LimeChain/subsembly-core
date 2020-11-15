import { CompactInt, UInt64, BIT_LENGTH, Codec, BytesReader, Byte } from 'as-scale-codec';
import { DecodedData } from '../decoded-data';
import { Extrinsic, ExtrinsicType } from './extrinsic';
import { Utils } from "../../utils";
import { IExtrinsic, IInherent } from '../interfaces';

export class Inherent extends Extrinsic implements IInherent {
    /**
     * Of inherent
     */
    public callIndex: u8[];
    /**
     * API version
     */
    public version: u8;
    /**
     * Compact prefix
     */
    public prefix: u8;
    /**
     * Inherent value
     */
    public arg: UInt64;

    constructor(callIndex: u8[] = [], version: u8 = 0, prefix: u8 = 0, arg: UInt64 = new UInt64()) {
        super(ExtrinsicType.Inherent);
        this.callIndex = callIndex;
        this.version = version;
        this.prefix = prefix;
        this.arg = arg;
    }

    /**
     * Get type id of the Extrinsic
     */
    getTypeId(): i32 {
        return <i32>this.typeId;
    }

    getArgument(): Codec {
        return this.arg;
    }

    getVersion(): u8 {
        return this.version;
    }

    getPrefix(): u8 {
        return this.prefix;
    }

    getCallIndex(): u8[] {
        return this.callIndex;
    }

    encodedLength(): i32 {
        return this.toU8a().length;
    }

    toU8a(): u8[] {
        let len = new CompactInt(ExtrinsicType.Inherent);
        let result = len.toU8a();
        result = result.concat([this.version])
            .concat(this.callIndex)
            .concat([this.prefix])
            .concat(this.arg.toU8a());
        return result.slice(0, <i32>len.value + len.encodedLength());
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        let length = bytesReader.readInto<CompactInt>();
        assert(<i32>length.value == <i32>this.typeId, "Inherent: incorrectly encoded Inherent");
        this.version = bytesReader.readInto<Byte>().value;
        this.callIndex = bytesReader.readBytes(2);
        this.prefix = bytesReader.readInto<Byte>().value;
        this.arg = bytesReader.readInto<UInt64>();
    }
    /**
     * Convert SCALE encoded bytes to an instance of Inherent
     */
    static fromU8Array(input: u8[]): DecodedData<IExtrinsic> {
        const bytesReader = new BytesReader(input);
        const version = bytesReader.readInto<Byte>().value;
        const callIndex = bytesReader.readBytes(2);
        const prefix = bytesReader.readInto<Byte>().value;
        const arg = bytesReader.readInto<UInt64>();
        const inherent = new Inherent(callIndex, version, prefix, arg);
        return new DecodedData(inherent, input);
    }

    @inline @operator('==')
    static eq(a: Inherent, b: Inherent): bool {
        return Utils.areArraysEqual(a.callIndex, b.callIndex) &&
            a.prefix == b.prefix &&
            a.version == b.version &&
            a.arg == b.arg;
    }

    @inline @operator('!=')
    static notEq(a: Inherent, b: Inherent): bool {
        return !Inherent.eq(a, b);
    }
}