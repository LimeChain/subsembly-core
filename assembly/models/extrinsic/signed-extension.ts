import { BytesReader, Codec, CompactInt } from "as-scale-codec";
import { ExtrinsicEra } from "./extrinsic-era";

/**
 * @description Represents SignedExtension trait, provides extra data for the Extrinsic
 * such as era, tip and nonce of the Extrinsic
 */
export class SignedExtension implements Codec {
    /**
     * Era  of signed extension
     */
    private _era: ExtrinsicEra;
    /**
     * Tip  of signed extension
     */
    private _tip: CompactInt;
    /**
     * Nonce  of signed extension
     */
    private _nonce: CompactInt;

    constructor(
        era: ExtrinsicEra = new ExtrinsicEra(),
        tip: CompactInt = new CompactInt(0),
        nonce: CompactInt = new CompactInt(0)
    ) {
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

    /**
     * Scale encode the instance
     * @returns u8a 
     */
    toU8a(): u8[] {
        return this.era.toU8a().concat(this.tip.toU8a()).concat(this.nonce.toU8a());
    }

    /**
     * Encoded length of the byte 
     * @returns length 
     */
    encodedLength(): i32 {
        return this.toU8a().length;
    }
    /**
     * Populates the instance from bytes 
     * @param bytes 
     * @param [index] 
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._era = bytesReader.readInto<ExtrinsicEra>();
        this._tip = bytesReader.readInto<CompactInt>();
        this._nonce = bytesReader.readInto<CompactInt>();
    }

    /**
     * Checks if an instance is equal with other instance
     * @param other other instance
     */
    eq(other: SignedExtension): bool {
        return (
        this.era.eq(other.era) &&
        this.tip.eq(other.tip) &&
        this.nonce.eq(other.nonce)
        );
    }

    /**
     * Checks if an instance is not equal with other instance
     * @param other 
     */
    notEq(other: SignedExtension): bool {
        return !this.eq(other);
    }
}
