import { BytesReader, Codec, CompactInt } from 'as-scale-codec';
import { DecodedData } from './decoded-data';

/**
 * @description Model that keeps the map of extrinsics to their indices
 */
export class ExtrinsicData<Index extends Codec, V extends Codec> implements Codec {
    /**
     * @description Extrinsic data for the current block 
     * (maps an extrinsic's index to its data/bytes)
     */
    public data: Map<Index, V>;
    
    constructor(data: Map<Index, V> = new Map<Index, V>()){
        this.data = data;
    }

    /**
     * @description Encodes into SCALE bytes
     */
    toU8a(): u8[]{
        let result: u8[] = [];
        let keys: Index[] = this.data.keys();
        let lenData: CompactInt = new CompactInt(<u8>(keys.length));
        result = result.concat(lenData.toU8a());
        for(let i = 0; i < keys.length; i++){
            result = result
            .concat(keys[i].toU8a())
            .concat(this.data.get(keys[i]).toU8a());
        }
        return result;
    }

    /**
     * @description Enumerated items, from which orderedTrieRoot will get 
     * The items consist of a SCALE encoded array containing only values, corresponding 
     * key of each value is the index of the item in the array, starting at 0.
     * In our case same as toU8a() but with only values concatenated
     */
    toEnumeratedValues(): u8[]{
        let result: u8[] = [];
        let keys: Index[] = this.data.keys();
        let lenData: CompactInt = new CompactInt(<u8>(keys.length));
        result = result.concat(lenData.toU8a());
        for(let i=0; i < keys.length; i++){
            let extLength = new CompactInt(this.data.get(keys[i]).toU8a().length);
            result = result
            .concat(extLength.toU8a())
            .concat(this.data.get(keys[i]).toU8a());
        }
        return result;
    }

    /**
     * @description Get data of the instance
     */
    getData(): Map<Index, V>{
        return this.data; 
    }

    /**
     * @description Insert entry to the map
     * @param key 
     * @param value 
     */
    insert(key: Index, value: V): void {
        this.data.set(key, value);
    }

    encodedLength(): i32{
        return this.toU8a().length;
    }
    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const lenComp = bytesReader.readInto<CompactInt>();
        for(let i: i32 = 0; i < lenComp.unwrap(); i++){
            const key = bytesReader.readInto<Index>();
            const value = bytesReader.readInto<V>();
            this.data.set(key, value);
        }
    }
    /**
     * @description Initializes ExtrinsicData from bytes
     * @param input SCALE encoded bytes
     */
    static fromU8Array<Index extends Codec, V extends Codec>(input: u8[], index: i32 = 0): DecodedData<ExtrinsicData<Index, V>>{
        const data: Map<Index, V> = new Map();
        const bytesReader = new BytesReader(input.slice(index));
        const lenKeys = bytesReader.readInto<CompactInt>();
        
        for (let i: i32 = 0; i < lenKeys.unwrap(); i++){
            const key = bytesReader.readInto<Index>();
            const value = bytesReader.readInto<V>();
            data.set(key, value);
        }
        const extcsData = new ExtrinsicData<Index, V>(data);
        return new DecodedData<ExtrinsicData<Index, V>>(extcsData, input);
    }   
    /**
     * @description Overloaded == operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    eq(other: ExtrinsicData<Index, V>): bool {
        let areEqual = true;
        const aKeys = this.data.keys();
        const bKeys = other.data.keys();

        if(aKeys.length != bKeys.length){
            return false;
        }
        for (let i=0; i<aKeys.length; i++){
            if(aKeys[i] != bKeys[i]){
                areEqual = false;
                break;
            }
        }
        return areEqual;
    }

    /**
     * @description Overloaded != operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    notEq(other: ExtrinsicData<Index, V>): bool {
        return !this.eq(other);
    }
}