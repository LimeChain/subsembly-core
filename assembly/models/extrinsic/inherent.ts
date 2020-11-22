import { Byte, BytesReader, Codec, CompactInt } from 'as-scale-codec';
import { IExtrinsic, IInherent } from '../interfaces';
import { Extrinsic, ExtrinsicType } from './extrinsic';

/**
 * @description Class representing Inherent type into Substrate
 */
export class Inherent<Arg extends Codec> extends Extrinsic implements IInherent{
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
    public arg: Arg;

    constructor(callIndex: u8[] = [], version: u8 = 0, prefix: u8 = 0, arg: Arg = instantiate<Arg>()){
        super(ExtrinsicType.Inherent);
        this.callIndex = callIndex;
        this.version = version;
        this.prefix = prefix;
        this.arg = arg;
    }

    /**
     * @description Get type id of the Extrinsic
     */
    getTypeId(): i32{
        return <i32>this.typeId;
    }

    /**
     * @description Get argument of inherent
     */
    getArgument(): Arg{
        return this.arg;
    }

    /**
     * @description Get api version
     */
    getVersion(): u8{
        return this.version;
    }

    /**
     * @description Get module prefix
     */
    getPrefix(): u8{
        return this.prefix;
    }

    /**
     * @description Get call index 
     */
    getCallIndex(): u8[]{
        return this.callIndex;
    }

    /**
     * @description Encoded byte length of the instance
     */
    encodedLength(): i32{
        return this.toU8a().length;
    }

    /**
     * @description Converts to SCALE encoded bytes
     */
    toU8a(): u8[]{
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
        this.arg = bytesReader.readInto<Arg>();
    }
    /**
     * @description Convert SCALE encoded bytes to an instance of Inherent
     */
    static fromU8Array<Arg extends Codec>(input: u8[], index: i32 = 0): IExtrinsic{
        const bytesReader = new BytesReader(input.slice(index));
        const version = bytesReader.readInto<Byte>().value;
        const callIndex = bytesReader.readBytes(2);
        const prefix = bytesReader.readInto<Byte>().value;
        const arg = bytesReader.readInto<Arg>();
        return new Inherent(callIndex, version, prefix, arg);
    }
}