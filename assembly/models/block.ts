import { ByteArray, BytesReader, CompactInt, Hash } from "as-scale-codec";
import { DecodedData, Extrinsic, Header, IExtrinsic, IHeader, Option } from ".";
import { Utils } from "../utils";
import { Constants } from "./constants";
import { Inherent } from "./extrinsic";
import { IBlock } from "./interfaces";

/**
 * @description Class representing a Block into the Substrate Runtime
 */
export class Block implements IBlock{

    /**
     * Block Header
     */
    public header: IHeader

    /**
     * Block header hash
     */
    public headerHash: Option<Hash>
    
    /**
     * Array of Extrinsics
     */
    public body: IExtrinsic[]
    /**
     * Block Receipt
     */
    public receipt: Option<ByteArray>
    /**
     * Block message queue
     */
    public messageQueue: Option<ByteArray>
    /**
     * Block Justification
     */
    public justification: Option<ByteArray>

    constructor(header: IHeader = new Header(), body: IExtrinsic[] = []) {
        this.header = header;
        this.headerHash = new Option<Hash>(null);
        this.body = body;
        this.receipt = new Option<ByteArray>(null);
        this.messageQueue = new Option<ByteArray>(null);
        this.justification = new Option<ByteArray>(null);
    }

    /**
    * @description SCALE Encodes the Block into u8[]
    */
    toU8a(): u8[] {
        let encoded = this.header.toU8a();
        if (this.body.length != 0) {
            const extrinsicsLength = new CompactInt(this.body.length);
            encoded = encoded.concat(extrinsicsLength.toU8a());
            for (let i = 0; i < this.body.length; i++) {
                encoded = encoded.concat(this.body[i].toU8a());
            }
        } else {
            encoded = encoded.concat(Constants.EMPTY_BYTE_ARRAY);
        }

        return encoded;
    }

    /**
     * @description Get header
     */
    getHeader(): IHeader{
        return this.header;
    }

    /**
     * @description Get array of extrinsics
     */
    getExtrinsics(): IExtrinsic[]{
        return this.body;
    }

    /**
     * @description Returns encoded byte length of the instance
     */
    encodedLength(): i32{
        let len = this.header.encodedLength();
        for(let i: i32 = 0; i< this.body.length; i++){
            len += this.body[i].encodedLength();
        }
        return len;
    }
    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        const bytesReader = new BytesReader(bytes.slice(index));
        this.header = bytesReader.readInto<Header>();
        let extrinsics: IExtrinsic[] = [];
        const extrinsicsLength = bytesReader.readInto<CompactInt>();
        for(let i=0; i < <i32>(extrinsicsLength.value); i++){
            const decodedExtrinsic: IExtrinsic= bytesReader.readInto<Extrinsic>();
            extrinsics.push(decodedExtrinsic);
        }
        this.body = extrinsics;
    }
    /**
     * @description Instanciates new Block object from SCALE encoded byte array
     * @param input - SCALE encoded Block
     */
    static fromU8Array(input: u8[]): DecodedData<IBlock> {
        const bytesReader = new BytesReader(input);
        const header: IHeader = bytesReader.readInto<Header>();

        const extrinsicsLength = bytesReader.readInto<CompactInt>();
        let extrinsics: IExtrinsic[] = [];
        for (let i = 0; i < <i32>extrinsicsLength.value; i++) {
            const decodedExtrinsic: IExtrinsic = bytesReader.readInto<Inherent>();
            extrinsics.push(decodedExtrinsic);
        }
        
        const block = new Block(header, extrinsics);
        return new DecodedData(block, input);
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    @inline @operator('==')
    static eq(a: Block, b: Block): bool {
        return a.header == b.header && Utils.areArraysEqual(a.body, b.body);
    }
}