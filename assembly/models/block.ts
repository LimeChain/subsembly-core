import { ByteArray, BytesReader, Codec, CompactInt, Hash } from "as-scale-codec";
import { DecodedData, Option } from ".";
import { Utils } from "../utils";
import { Constants } from "./constants";

/**
 * @description A phase of a block's execution.
 */
export enum ExecutionPhase {
    /// Applying an extrinsic.
	ApplyExtrinsic = 0,
	/// Finalizing the block.
	Finalization = 1,
	/// Initializing the block.
	Initialization = 2,
}

/**
 * @description Codec implementation of Phase
 */
export class Phase<Arg extends Codec> implements Codec {
    private _phase: ExecutionPhase;
    private _arg: Arg;

    constructor(phase: ExecutionPhase = ExecutionPhase.Initialization, arg: Arg = instantiate<Arg>(0)) {
        this._phase = phase;
        this._arg = arg;
    }

    toU8a(): u8[] {
        if(this._phase == ExecutionPhase.ApplyExtrinsic) {
            return [<u8>this._phase].concat(this._arg.toU8a());
        }
        return [<u8>this._phase];
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        switch(bytes[index]) {
            case ExecutionPhase.ApplyExtrinsic: 
                this._phase = ExecutionPhase.ApplyExtrinsic;
                this._arg = BytesReader.decodeInto<Arg>(bytes.slice(index + 1));
            case ExecutionPhase.Finalization:
                this._phase = ExecutionPhase.Finalization;
            case ExecutionPhase.Initialization:
                this._phase = ExecutionPhase.Initialization;
            default:
                this._phase = ExecutionPhase.Initialization;
        }
    }

    encodedLength(): i32 {
        if(this._phase == ExecutionPhase.ApplyExtrinsic) {
            return 1 + this._arg.encodedLength();
        }
        return 1;
    }

    eq(other: Phase<Arg>): bool {
        return this._phase == other._phase;
    } 

    notEq(other: Phase<Arg>): bool {
        return !this.eq(other);
    }
}

/**
 * @description Class representing a Block into the Substrate Runtime
 */
export class Block<H extends Codec, E extends Codec> implements Codec{

    /**
     * Block Header
     */
    public header: H

    /**
     * Block header hash
     */
    public headerHash: Option<Hash>
    
    /**
     * Array of Extrinsics
     */
    public body: E[]
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

    constructor(header: H = instantiate<H>(), body: E[] = []) {
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
    getHeader(): H{
        return this.header;
    }

    /**
     * @description Get array of extrinsics
     */
    getExtrinsics(): E[]{
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
        this.header = bytesReader.readInto<H>();
        let extrinsics: E[] = [];
        const extrinsicsLength = bytesReader.readInto<CompactInt>();
        for(let i=0; i < <i32>(extrinsicsLength.unwrap()); i++){
            const decodedExtrinsic: E = bytesReader.readInto<E>();
            extrinsics.push(decodedExtrinsic);
        }
        this.body = extrinsics;
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    eq(other: Block<H, E>): bool {
        return this.header == other.header && Utils.areArraysEqual(this.body, other.body);
    }
    
    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    notEq(other: Block<H, E>): bool {
        return !this.eq(other);
    }

    /**
     * @description Instanciates new Block object from SCALE encoded byte array
     * @param input - SCALE encoded Block
     */
    static fromU8Array<H extends Codec, E extends Codec>(input: u8[], index: i32 = 0): DecodedData<Block<H, E>> {
        const bytesReader = new BytesReader(input.slice(index));
        const header: H = bytesReader.readInto<H>();

        const extrinsicsLength = bytesReader.readInto<CompactInt>();
        let extrinsics: E[] = [];
        for (let i = 0; i < <i32>extrinsicsLength.unwrap(); i++) {
            const decodedExtrinsic: E = bytesReader.readInto<E>();
            extrinsics.push(decodedExtrinsic);
        }
        
        const block = new Block(header, extrinsics);
        return new DecodedData(block, input);
    }
}