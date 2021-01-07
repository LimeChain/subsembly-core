import { BytesReader, Codec, CompactInt } from "as-scale-codec";
import { Utils } from "../../utils";
import { Call } from "./call";
import { ExtrinsicSignature } from "./extrinsic-signature";

export class GenericExtrinsic implements Codec {
    private _method: Call;
    private _signature: ExtrinsicSignature;

    constructor(
        method: Call = new Call(), 
        signature: ExtrinsicSignature = new ExtrinsicSignature())
    {
        this._method = method;
        this._signature = signature;
    }

    public get method(): Call {
        return this._method;
    }

    public get signature(): ExtrinsicSignature {
        return this._signature;
    }

    toU8a(): u8[] {
        let encoded: u8[] = this.signature.toU8a()
            .concat(this.method.toU8a())
        return Utils.encodeCompact(encoded);
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const _len = bytesReader.readInto<CompactInt>();
        // check whether signing bit is set
        if(bytesReader.bytes[0] == 132){
            this._signature = bytesReader.readInto<ExtrinsicSignature>();
            this._method = bytesReader.readInto<Call>();
            return ;
        }
        else {
            this._method = bytesReader.readInto<Call>();
            return ;
        }
    }

    encodedLength(): i32 {
        return this.toU8a().length;
    }

    eq(other: GenericExtrinsic): bool {
        return this.signature.eq(other.signature) && this.method.eq(other.method);
    }

    notEq(other: GenericExtrinsic): bool {
        return !this.eq(other);
    }
}