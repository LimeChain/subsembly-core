import { BytesReader, Codec } from "as-scale-codec";
import { Utils } from "../../utils";

/**
 * Class that represents Dispatchable type of Substrate
 */
export class Call implements Codec{
    /**
     * Call index of call: contains module index followed by method index
     */
    private _callIndex: u8[];

    /**
     * Arguments for the call
     */
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
    
    /**
     * Encoded length of the byte array
     * @returns length 
     */
    encodedLength(): i32 {
        return this.toU8a().length;
    }
    
    /**
     * SCALE encode instance
     * @returns u8a 
     */
    toU8a(): u8[] {
        return this._callIndex.concat(this._args);
    }

    /**
     * equals operator
     * @param other 
     * @returns eq 
     */
    eq(other: Codec): bool {
        return Utils.areArraysEqual(this.toU8a(), other.toU8a());
    }

    /**
     * Not equals
     * @param other 
     * @returns eq 
     */
    notEq(other: Codec): bool {
        return this.eq(other);
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._callIndex = bytesReader.readBytes(2);
        this._args = bytesReader.getLeftoverBytes();
    }
}