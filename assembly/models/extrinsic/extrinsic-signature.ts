import { Byte, BytesReader, Codec } from "as-scale-codec";
import { SignedExtension } from "./signed-extension";

/**
 * @description Class representing Substrate ExtrinsicSignature type in AS
 */
export class ExtrinsicSignature<Address extends Codec, S extends Codec> 
    implements Codec {
    /**
     * Signer of extrinsic signature
     */
    private _signer: Address;
    /**
     * Signature  of extrinsic signature
     */
    private _signature: S;
    /**
     * Signed extension of extrinsic signature
     */
    private _signedExtension: SignedExtension;
    /**
     * Determines whether the instance is empty
     */
    private _isEmpty: bool;

    constructor(
        isEmpty: bool = true,
        signer: Address = instantiate<Address>(),
        signature: S = instantiate<S>(),
        signedExtension: SignedExtension = new SignedExtension(),
        )
    {
        this._signer = signer;
        this._signature = signature;
        this._signedExtension = signedExtension;
        this._isEmpty = isEmpty;
    }

    get signer(): Address {
        return this._signer;
    }

    get signature(): S {
        return this._signature;
    }

    get signedExtension(): SignedExtension {
        return this._signedExtension;
    }

    get isEmpty(): bool {
        return this._isEmpty;
    }

    /**
     * @description SCALE encodes the instance
     */
    toU8a(): u8[] {
        // V4, signing bit set
        if(this.isEmpty){
            return [];
        }
        const EXTRINSIC_VERSION: u8[] = [132];
        const LOOKUP: u8[] = [1];
        return EXTRINSIC_VERSION.concat(this.signer.toU8a())
            .concat(LOOKUP)
            .concat(this.signature.toU8a())
            .concat(this.signedExtension.toU8a());
    }

    /**
     * @description Encoded byte length of the instance
     */
    encodedLength(): i32 {
        return 1 + this.signer.encodedLength() + this.signature.encodedLength() + this.signedExtension.encodedLength();
    }

    /**
     * @description Non-static constructor method used to populate defined properties of the model
     * @param bytes SCALE encoded bytes
     * @param index index to start decoding the bytes from
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._isEmpty = false;
        this._signer = bytesReader.readInto<Address>();
        const _lookup = bytesReader.readInto<Byte>().unwrap();
        this._signature = bytesReader.readInto<S>();
        this._signedExtension = bytesReader.readInto<SignedExtension>();
    }

    /**
     * Checks if an instance is equal with other instance
     * @param other other instance     
    */
    eq(other: ExtrinsicSignature<Address, S>): bool {
        return this.signer.eq(other.signer)
            && this.signature.eq(other.signature)
            && this.signedExtension.eq(other.signedExtension);
    }

    /**
     * Checks if an instance is not equal with other instance
     * @param other other instance
     */
    notEq(other: ExtrinsicSignature<Address, S>): bool {
        return !this.eq(other);
    }
}