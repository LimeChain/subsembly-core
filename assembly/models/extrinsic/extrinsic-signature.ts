import { Byte, BytesReader, Codec } from "as-scale-codec";
import { SignedExtension } from "./signed-extension";

export class ExtrinsicSignature<Address extends Codec, S extends Codec> 
    implements Codec {

    private _signer: Address;
    private _signature: S;
    private _signedExtension: SignedExtension;
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

    toU8a(): u8[] {
        // V4, signing bit set
        if(this.isEmpty){
            return [];
        }
        const EXTRINSIC_VERSION: u8[] = [132];
        return EXTRINSIC_VERSION.concat(this.signer.toU8a())
            .concat(this.signature.toU8a())
            .concat(this.signedExtension.toU8a());
    }

    encodedLength(): i32 {
        return 1 + this.signer.encodedLength() + this.signature.encodedLength() + this.signedExtension.encodedLength();
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._isEmpty = false;
        this._signer = bytesReader.readInto<Address>();
        const _signature = bytesReader.readInto<Byte>().unwrap();
        this._signature = bytesReader.readInto<S>();
        this._signedExtension = bytesReader.readInto<SignedExtension>();
    }

    eq(other: ExtrinsicSignature<Address, S>): bool {
        return this.signer.eq(other.signer)
            && this.signature.eq(other.signature)
            && this.signedExtension.eq(other.signedExtension);
    }

    notEq(other: ExtrinsicSignature<Address, S>): bool {
        return !this.eq(other);
    }
}