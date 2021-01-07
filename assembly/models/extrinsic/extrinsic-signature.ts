import { BytesReader, Codec } from "as-scale-codec";
import { AccountId } from "../account-id";
import { Signature } from "../signature";
import { SignedExtension } from "./signed-extension";

export class ExtrinsicSignature implements Codec {
    private _signer: AccountId;
    private _signature: Signature;
    private _signedExtension: SignedExtension;
    private _isEmpty: bool;

    constructor(
        isEmpty: bool = true,
        signer: AccountId = new AccountId(),
        signature: Signature = new Signature(),
        signedExtension = new SignedExtension(),
        )
    {
        this._signer = signer;
        this._signature = signature;
        this._signedExtension = signedExtension;
        this._isEmpty = isEmpty;
    }

    get signer(): AccountId {
        return this._signer;
    }

    get signature(): Signature {
        return this._signature;
    }

    get signedExtension(): SignedExtension {
        return this._signedExtension;
    }

    get isEmpty(): bool {
        return this._isEmpty;
    }

    set isEmpty(value: bool) {
        this._isEmpty = value;
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
        const _EXTRINSIC_VERSION = bytesReader.readBytes(1);
        if(_EXTRINSIC_VERSION[0] == 132) {
            this._isEmpty = false;
            this._signer = bytesReader.readInto<AccountId>();
            this._signature = bytesReader.readInto<Signature>();
            this._signedExtension = bytesReader.readInto<SignedExtension>();
            return ;
        }
        else {
            this._isEmpty = true;
            return ;
        }
    }

    eq(other: ExtrinsicSignature): bool {
        return this.signer.eq(other.signer)
            && this.signature.eq(other.signature)
            && this.signedExtension.eq(other.signedExtension);
    }

    notEq(other: ExtrinsicSignature): bool {
        return !this.eq(other);
    }
}