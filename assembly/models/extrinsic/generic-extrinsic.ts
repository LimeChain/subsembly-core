import { Bool, Byte, BytesReader, Codec, CompactInt, UInt64 } from "as-scale-codec";
import { Utils } from "../../utils";
import { TransactionTag, TransactionValidity, ValidTransaction } from "../transaction-models";
import { Call } from "./call";
import { ExtrinsicSignature } from "./extrinsic-signature";
import { Transfer } from "./transfer";

export enum TransactionSource {
    InBlock = 0,
    Local = 1,
    External = 2,
}

export class GenericExtrinsic<Address extends Codec, B extends Codec, N extends Codec, S extends Codec> implements Codec {
    private _method: Call;
    private _signature: ExtrinsicSignature<Address, S>;
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

    isSigned(): bool {
        return !this.signature.isEmpty;
    }

    asTransfer(): Transfer<Address, B, N> {
        const bytesReader = new BytesReader(this.method.args);
        const receiver = bytesReader.readInto<Address>();
        const value = bytesReader.readInto<B>();
        const compactNonce = this.signature.signedExtension.nonce;
        const nonce = instantiate<N>(compactNonce.unwrap());
        return new Transfer(
            this.signature.signer,
            receiver,
            value,
            nonce
        );
    }

    toU8a(): u8[] {
        let encoded: u8[] = this.signature.toU8a()
            .concat(this.method.toU8a())
        return Utils.encodeCompact(encoded);
    }

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

    encodedLength(): i32 {
        return this.toU8a().length;
    }

    eq(other: GenericExtrinsic<Address, B, N, S>): bool {
        return this.signature.eq(other.signature) && this.method.eq(other.method);
    }

    notEq(other: GenericExtrinsic<Address, B, N, S>): bool {
        return !this.eq(other);
    }

    validate(_source: TransactionSource): ValidTransaction<Address, N> {
        const from = this.signature.signer;
        const nonce = instantiate<N>(this.signature.signedExtension.nonce.unwrap());
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

    validateUnsigned(): TransactionValidity {
        return new TransactionValidity(
            true, [], "Valid transaction"
        );
    }
}