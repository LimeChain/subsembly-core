import { Bytes, BytesReader, Codec, CompactInt } from 'as-scale-codec';
import { Utils } from "../utils";
import { DecodedData } from './decoded-data';

/**
 * @description Class representing InherentData transactions in Substrate runtime
 */

export class InherentData<V extends Codec> implements Codec {
    
    /**
    * Length of the InherentIdentifier in InherentData
    */
    public static readonly INHERENT_IDENTIFIER_LENGTH:i32 = 8;

    /**
     * A hashtable (Map, in our case) representing the totality of 
     * inherent extrinsics included in each block. 
     */
    public data: Map<string, V>;

    constructor(data: Map<string, V> = new Map<string, V>()){
        let keys: string[] = data.keys();
        for (let i = 0; i < keys.length; i++){
            assert(keys[i].length == 8, "InherentData: Key length should be equal to 8!");
        }
        this.data = data;
    } 

    /**
     * @description Get data
     */
    getData(): Map<string, V>{
        return this.data;
    }
    /**
     * @description Encoded byte length of the instance
     */
    encodedLength(): i32{
        let keyLength: i32 = this.data.keys().length * InherentData.INHERENT_IDENTIFIER_LENGTH;
        let valueLength: i32 = 0;
        for(let i: i32 = 0; i < this.data.values().length; i++){
            valueLength += this.data.values()[i].encodedLength();
        }
        return keyLength + valueLength;
    }
    /**
     * @description SCALE Encodes the InherentData into u8[]
     */
    toU8a(): u8[] {
        let result: u8[] = [];
        let keys: string[] = this.data.keys();
        const len: CompactInt = new CompactInt(keys.length);
        result = result.concat(len.toU8a());
        for (let i = 0; i<keys.length; i++){
            const u8Key = Uint8Array.wrap(String.UTF8.encode(keys[i]));
            result = result.concat(Utils.toU8Array(u8Key));
            
            const value: u8[] = this.data.get(keys[i]).toU8a();
            result = result.concat(value);
        }
        return result;
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
            const buff = new Uint8Array(InherentData.INHERENT_IDENTIFIER_LENGTH);
            Bytes.copyToTyped(bytesReader.readBytes(InherentData.INHERENT_IDENTIFIER_LENGTH), buff);
            let key: string =  String.UTF8.decode(buff.buffer);
            let value: V = bytesReader.readInto<V>();
            this.data.set(key, value);
        }
    }
    /**
     * @description Creates a new instance of InherentData class from SCALE encoded array of bytes
     * @param input Takes SCALE encoded array of bytes as an argument
     */
    static fromU8Array<V extends Codec>(input: u8[], index: i32 = 0): DecodedData<InherentData<V>> {
        const data: Map<string, V> = new Map<string, V>();
        const bytesReader = new BytesReader(input.slice(index));
        const lenComp = bytesReader.readInto<CompactInt>();

        for (let i: i32 = 0; i<lenComp.value; i++){
            const buff = new Uint8Array(InherentData.INHERENT_IDENTIFIER_LENGTH);
            Bytes.copyToTyped(bytesReader.readBytes(InherentData.INHERENT_IDENTIFIER_LENGTH), buff);
            let key: string =  String.UTF8.decode(buff.buffer);
            let value: V = bytesReader.readInto<V>();
            data.set(key, value);
        }
        const inherentData = new InherentData(data);
        return new DecodedData<InherentData<V>>(inherentData, input);
    }

    /**
     * @description Overloaded == operator
     * @param a instance of InherentData
     * @param b Instance of InherentData
     */
    eq(other: InherentData<V>): bool {
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
     * @param a instance of InherentData
     * @param b Instance of InherentData
     */
    @inline @operator('!=')
    notEq(other: InherentData<V>): bool{
        return !this.eq(other);
    }
}
