import { BytesReader, Codec, CompactInt } from 'as-scale-codec';
import { Inherent } from "./inherent";
import { SignedTransaction } from "./signed-transaction";

/**
 * @description Type of extrinsic
 * Values represent the fixed byte length of each Extrinsic type
 */
export enum ExtrinsicType{
    /**
     * Inherents (no signature; created by validators during block production)
    */
    Inherent = 10,
    /**
     * Signed Transactions (with signature; a regular transactions with known origin)
     */
    SignedTransaction = 145,
    /**
     * Unsigned Transactions (no signature; represent "system calls" or other special kinds of calls)
     */
    UnsignedTransaction = 81,
}

/**
 * Base class representing Extrinsic into the Substrate runtime
 */
export abstract class Extrinsic implements Codec{
    /**
     * Type of extrinsic
     */
    public typeId: u64;

    constructor(typeId: u64 = ExtrinsicType.Inherent){
        this.typeId = typeId;
    }

    /**
     * @description SCALE encodes instance to u8[]
     */
    abstract toU8a(): u8[];
    
    /**
     * @description Get type id of the Extrinsic
     */
    getTypeId(): i32{
        return <i32>this.typeId;
    }

    /**
     * @description Checks whether the extrinsic is inherent
     * @param ext 
     */
    static isInherent(ext: Extrinsic): bool{
        return ext.getTypeId() == ExtrinsicType.Inherent;
    }
    
    /**
     * @description Encoded byte length of the instance
     */
    abstract encodedLength(): i32;

    /**
     * @description Non-static constructor
     * @param bytes 
     * @param index 
     */
    abstract populateFromBytes(bytes: u8[], index: i32): void;

    /**
     * @description Static constructor
     * @param input 
     */
    static fromU8Array(input: u8[], index: i32 = 0): Extrinsic{
        const bytesReader = new BytesReader(input.slice(index));
        const cmpLen = bytesReader.readInto<CompactInt>();
        const type = <i32>cmpLen.value;
        switch(type){
            case ExtrinsicType.Inherent:{
                return Inherent.fromU8Array(bytesReader.getLeftoverBytes());
            }
            case ExtrinsicType.SignedTransaction:{
                return SignedTransaction.fromU8Array(bytesReader.getLeftoverBytes());
            }
            default: {
                throw new Error("Extrinsic: Unsupported Extrinsic type: " + type.toString());
            }
        }
    }

}