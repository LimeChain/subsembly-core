import { BytesReader, Codec } from "as-scale-codec";
import { Utils } from "../../utils";

export class Call implements Codec{
    private _callIndex: u8[];
    private _args: u8[];

    constructor(callIndex: u8[] = <u8[]>[1, 0], args: u8[] = []){
        this._callIndex = callIndex;
        this._args = args;
    }

    get callIndex(): u8[] {
        return this._callIndex;
    }
    
    get args(): u8[] {
        return this._args;
    }
    encodedLength(): i32 {
        return this.toU8a().length;
    }

    toU8a(): u8[] {
        return this._callIndex.concat(this._args);
    }

    eq(other: Codec): bool {
        return Utils.areArraysEqual(this.toU8a(), other.toU8a());
    }
    notEq(other: Codec): bool {
        return this.eq(other);
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._callIndex = bytesReader.readBytes(2);
        this._args = bytesReader.getLeftoverBytes();
    }
}