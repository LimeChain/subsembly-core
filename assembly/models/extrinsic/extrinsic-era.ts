import { BytesReader, Codec } from "as-scale-codec";

/**
 * Gets trailing zeros of byte representation of the number
 * @param num 
 * @returns trailing zeros 
 */
function getTrailingZeros(num: u64): i32 {
    const binary = num.toString(2);
    let index: i32 = 0;
    while (binary.charAt(binary.length - 1 - index) == '0'){
        index++;
    }
    return index;
}

export enum Era {
    /// The transaction is valid forever. The genesis hash must be present in the signed content.
    Immortal = 0,
    /// Period and phase are encoded:
	/// - The period of validity from the block hash found in the signing material.
	/// - The phase in the period that this transaction's lifetime begins (and, importantly,
	/// implies which block hash is included in the signature material). If the `period` is
	/// greater than 1 << 12, then it will be a factor of the times greater than 1<<12 that
	/// `period` is.
	///
	/// When used on `FRAME`-based runtimes, `period` cannot exceed `BlockHashCount` parameter
	/// of `system` module.
    Mortal = 1
}

/**
 * @description Represents Substrate's Era type
 */
export class ExtrinsicEra implements Codec {
    /**
     * Type  of extrinsic era
     */
    private _type: Era;
    
    /**
     * Period  of extrinsic era
     */
     private _period: u64;
    
     /**
     * Phase  of extrinsic era
     */
    private _phase: u64;

    constructor(type: Era = Era.Immortal, period: u64 = 0, phase: u64 = 0){
        this._type = type;
        this._period = period;
        this._phase = phase;
    }
    
    get phase(): u64 {
        return this._phase;
    }

    get period(): u64 {
        return this._period;
    }

    get type(): Era {
        return this._type;
    }
    
    /**
     * @description The length of Uint8Array when the value is encoded
     * @returns length 
     */
    encodedLength(): i32 {
        switch(this._type){
            case Era.Immortal: {
                return 1;
            }
            case Era.Mortal: {
                return 2;
            }
            default: {
                return 1;
            }
        }
    }

    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specification
     * @returns u8a 
     */
    toU8a(): u8[] {
        switch(this._type) {
            case Era.Immortal: {
                return <u8[]>[0];
            }
            case Era.Mortal: {
                const quantizeFactor = <u64>Math.max((this.period >> 12) as f64, 1 as f64);
                const trailingZeros: u64 = getTrailingZeros(this.period) as u64;
                const encoded = <u64>Math.min(15 as f64, Math.max(1 as f64, (trailingZeros - 1) as f64)) + <u64>(((this.phase / quantizeFactor) << 4));
                const first = <u8>(encoded >> 8);
                const second = <u8>(encoded & 0xff);
                return <u8[]>[second, first];
            }
            default: {
                return <u8[]>[0]
            }
        }
    }
    
    /**
     * Checks if an instance is equal with other instance
     * @param other other instance     
     * @returns eq 
     */
    eq(other: ExtrinsicEra): bool {
        return this.type == other.type 
            && this.period == other.period 
            && this.phase == other.phase;
    }
    
    /**
     * Checks if an instance is not equal with other instance
     * @param other other instance
     */
    notEq(other: ExtrinsicEra): bool {
        return !this.eq(other);
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const first = bytesReader.readBytes(1);
        if(first[0] == 0) {
            this._type = Era.Immortal;
            return ;
        }
        else{
            const encoded: u64 = 
                <u64>(first[0]) + 
                ((<u64>(bytesReader.readBytes(1)[0]) << 8));
            let period: u64 = 2 << (encoded % <u64>(1 << 4));
            
            let quantizeFactor: u64 = <u64>Math.max((period >> 12) as f64, 1 as f64);
            let phase: u64 = (encoded >> 4) * quantizeFactor;
            if (period >= 4 && phase < period) {
                this._type = Era.Mortal;
                this._period = period;
                this._phase = phase;
            }
            else {
                throw new Error("Error in decoding ExtrinsicEra");
            }
        }
    }
}