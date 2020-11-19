import { ByteArray, BytesReader, CompactInt, UInt32 } from 'as-scale-codec';
import { DecodedData } from './decoded-data';
import { IExtrinsicData } from './interfaces';

/**
 * @description Model that keeps the map of extrinsics to their indices
 */
export class ExtrinsicData implements IExtrinsicData {
    /**
     * @description Extrinsic data for the current block 
     * (maps an extrinsic's index to its data/bytes)
     */
    public data: Map<UInt32, ByteArray>;
    
    constructor(data: Map<UInt32, ByteArray> = new Map<UInt32, ByteArray>()){
        this.data = data;
    }

    /**
     * @description Encodes into SCALE bytes
     */
    toU8a(): u8[]{
        let result: u8[] = [];
        let keys: UInt32[] = this.data.keys();
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
        let keys: UInt32[] = this.data.keys();
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
    getData(): Map<UInt32, ByteArray>{
        return this.data; 
    }

    /**
     * @description Insert entry to the map
     * @param key 
     * @param value 
     */
    insert(key: UInt32, value: ByteArray): void {
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
        for(let i: i32 = 0; i < lenComp.value; i++){
            const key = bytesReader.readInto<UInt32>();
            const value = bytesReader.readInto<ByteArray>();
            this.data.set(key, value);
        }
    }
    /**
     * @description Initializes ExtrinsicData from bytes
     * @param input SCALE encoded bytes
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<ExtrinsicData>{
        const data: Map<UInt32, ByteArray> = new Map();
        const bytesReader = new BytesReader(input.slice(index));
        const lenKeys = bytesReader.readInto<CompactInt>();
        
        for (let i: u64 = 0; i < lenKeys.value; i++){
            const key = bytesReader.readInto<UInt32>();
            const value = bytesReader.readInto<ByteArray>();
            data.set(key, value);
        }
        const extcsData = new ExtrinsicData(data);
        return new DecodedData<ExtrinsicData>(extcsData, input);
    }   
    /**
     * @description Overloaded == operator
     * @param a instance of ExtrinsicData
     * @param b Instance of ExtrinsicData
     */
    @inline @operator('==')
    static eq(a: ExtrinsicData, b: ExtrinsicData): bool {
        let areEqual = true;
        const aKeys = a.data.keys();
        const bKeys = b.data.keys();

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
    @inline @operator('==')
    static notEq(a: ExtrinsicData, b: ExtrinsicData): bool {
        return !ExtrinsicData.eq(a, b);
    }
}