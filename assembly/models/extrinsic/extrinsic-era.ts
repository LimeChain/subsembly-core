import { BytesReader, Codec, UInt64 } from "as-scale-codec";
import { Log } from "../../modules";

function getTrailingZeros(num: u64): i32 {
    const binary = num.toString(2);
    let index: i32 = 0;
    while (binary.charAt(binary.length - 1 - index) == '0'){
        index++;
    }
    return index;
}

export enum Era {
    Immortal = 0,
    Mortal = 1
}

export class ExtrinsicEra implements Codec {
    private _type: Era;
    private _period: u64;
    private _phase: u64;

    constructor(type: Era = Era.Mortal, period: u64 = 0, phase: u64 = 0){
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

    encodedLength(): i32 {
        switch(this._type){
            case Era.Immortal: {
                return 1;
            }
            case Era.Mortal: {
                return 2;
            }
        }
    }

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
                return <u8[]>[first, second];
            }
        }
    }

    eq(other: ExtrinsicEra): bool {
        return this.type == other.type 
            && this.period == other.period 
            && this.phase == other.phase;
    }

    notEq(other: ExtrinsicEra): bool {
        return !this.eq(other);
    }


    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const first = bytesReader.readBytes(1);
        if(first[0] == 0) {
            this._type = Era.Immortal;
            return ;
        }
        else{
            const encoded: u64 = 
                BytesReader.decodeInto<UInt64>(first).unwrap() + 
                ((BytesReader.decodeInto<UInt64>(bytesReader.readBytes(1)).unwrap() << 8));
            let period = 2 << (encoded % (1 << 4));
            let quantizeFactor = <u64>Math.max((period >> 12) as f64, 1 as f64);
            let phase = (encoded >> 4) * quantizeFactor;
            if (period >= 4 && phase < period) {
                this._type = Era.Mortal;
                this._period = period;
                this._phase = phase;
            }
            else {
                Log.error("Era: Invalid period and phase!");
                throw new Error();
            }
            return;
        }
    }
}