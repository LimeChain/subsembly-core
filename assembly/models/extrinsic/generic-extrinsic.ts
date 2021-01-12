import { Bool, Byte, BytesReader, Codec, CompactInt, UInt64 } from "as-scale-codec";
import { Utils } from "../../utils";
import { TransactionTag, TransactionValidity, ValidTransaction } from "../transaction-models";
import { Call } from "./call";
import { ExtrinsicSignature } from "./extrinsic-signature";

/**
 * @description Source of the Transaction
 */
export enum TransactionSource {
    InBlock = 0,
    Local = 1,
    External = 2,
}

/**
 * @description Represents Substrate's Extrinsic type
 */
export class GenericExtrinsic<Address extends Codec, B extends Codec, N extends Codec, S extends Codec> implements Codec {
    /**
     * Method  of generic extrinsic
     */
    private _method: Call;
    /**
     * Signature  of generic extrinsic
     */
    private _signature: ExtrinsicSignature<Address, S>;

    /**
     * Signing bit set constant
     */
    static readonly SIGNING_BIT_SET: u8 = 132;

    constructor(
        method: Call = new Call(), 
        signature: ExtrinsicSignature<Address, S> = new ExtrinsicSignature())
    {
        this._method = method;
        this._signature = signature;
    }

    public get method(): Call {
        return this._method;
    }

    public get signature(): ExtrinsicSignature<Address, S> {
        return this._signature;
    }

    /**
     * @description The payload being signed in transactions.
     */
    getPayload(): u8[] {
        return this.method.toU8a()
            .concat(this.signature.signedExtension.toU8a());
    }

    /**
     * @description Determines whether the extrinsic is signed
     * @returns signed 
     */
    isSigned(): bool {
        return !this.signature.isEmpty;
    }

    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specification
     * @returns u8a 
     */
    toU8a(): u8[] {
        let encoded: u8[] = this.signature.toU8a()
            .concat(this.method.toU8a())
        return Utils.encodeCompact(encoded);
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        const _len = bytesReader.readInto<CompactInt>();
        // check whether signing bit is set
        const signedOrVersion: u8 = bytesReader.readInto<Byte>().unwrap();
        if(signedOrVersion == GenericExtrinsic.SIGNING_BIT_SET) {
            this._signature = bytesReader.readInto<ExtrinsicSignature<Address, S>>();
            this._method = bytesReader.readInto<Call>();
            return ;
        }
        else {
            this._method = bytesReader.readInto<Call>();
            return ;
        }
    }

    /**
     * @description The length of Uint8Array when the value is encoded
     */
    encodedLength(): i32 {
        return this.toU8a().length;
    }

    /**
     * Checks if an instance is equal with other instance
     * @param other other instance     
    */
    eq(other: GenericExtrinsic<Address, B, N, S>): bool {
        return this.signature.eq(other.signature) && this.method.eq(other.method);
    }

    /**
     * Checks if an instance is not equal with other instance
     * @param other other instance
     */
    notEq(other: GenericExtrinsic<Address, B, N, S>): bool {
        return !this.eq(other);
    }

    /**
     * @description Validate this extrinsic instance
     * @param _source 
     * @returns ValidTransaction instance
     */
    validate(_source: TransactionSource): ValidTransaction<Address, N> {
        const from = this.signature.signer;
        const nonce = instantiate<N>(<u32>this.signature.signedExtension.nonce.unwrap());
        /**
         * If all the validations are passed, construct validTransaction instance
         */
        const priority: UInt64 = new UInt64(this.getPayload().length);
        const requires: TransactionTag<Address, N>[] = [];
        const provides: TransactionTag<Address, N>[] = [new TransactionTag(from, nonce)];
        const longevity: UInt64 = new UInt64(64);
        const propogate: Bool = new Bool(true);
        return new ValidTransaction<Address, N>(
            priority,
            requires,
            provides,
            longevity,
            propogate
        );
    }

    /**
     * @description Validate unsigned transaction
     * @returns TransactionValidity instance
     */
    validateUnsigned(): TransactionValidity {
        return new TransactionValidity(
            true, [], "Valid transaction"
        );
    }
}