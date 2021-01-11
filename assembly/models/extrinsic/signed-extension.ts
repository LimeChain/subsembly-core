import { BytesReader, Codec, CompactInt } from "as-scale-codec";
import { ExtrinsicEra } from "./extrinsic-era";

export class  SignedExtension implements Codec {
    private _era: ExtrinsicEra;
    private _tip: CompactInt;
    private _nonce: CompactInt;

    constructor(era: ExtrinsicEra = new ExtrinsicEra(), tip: CompactInt = new CompactInt(0), nonce: CompactInt = new CompactInt(0)) {
        this._era = era;
        this._tip = tip;
        this._nonce = nonce;
    }

    get era(): ExtrinsicEra {
        return this._era;
    }

    get tip(): CompactInt {
        return this._tip;
    }

    get nonce(): CompactInt {
        return this._nonce;
    }

    toU8a(): u8[] {
        return this.era.toU8a()
            .concat(this.tip.toU8a())
            .concat(this.nonce.toU8a());
    }

    encodedLength(): i32 {
        return this.toU8a().length;
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._era = bytesReader.readInto<ExtrinsicEra>();
        this._tip = bytesReader.readInto<CompactInt>();
        this._nonce = bytesReader.readInto<CompactInt>();
    }

    eq(other: SignedExtension): bool {
        return this.era.eq(other.era) 
            && this.tip.eq(other.tip) 
            && this.nonce.eq(other.nonce);
    }

    notEq(other: SignedExtension): bool {
        return !this.eq(other);
    }
}