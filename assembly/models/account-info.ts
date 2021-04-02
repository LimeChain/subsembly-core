import { BytesReader, Codec, CompactInt } from "as-scale-codec";

export class AccountInfo<Nonce extends Codec, Data extends Codec> implements Codec{
    private _nonce: Nonce;
    
    public get nonce(): Nonce {
        return this._nonce;
    }
    
    private _refCount: CompactInt;
    
    public get refCount(): CompactInt {
        return this._refCount;
    }

    private _data: Data;
    
    public get data(): Data {
        return this._data;
    }

    constructor(
        nonce: Nonce = instantiate<Nonce>(), 
        refCount: CompactInt = instantiate<CompactInt>(),
        data: Data = instantiate<Data>()
        ) {
        this._nonce = nonce;
        this._refCount = refCount;
        this._data = data;
    }

    setNonce(nonce: Nonce): void {
        this._nonce = nonce;
    }
    setData(data: Data): void {
        this._data = data;
    }
    
    toU8a(): u8[] {
        return this._nonce.toU8a()
            .concat(this._refCount.toU8a())
            .concat(this._data.toU8a());
    }

    encodedLength(): i32 {
        return this._nonce.encodedLength() + this._refCount.encodedLength() + this._data.encodedLength();
    }

    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this._nonce = bytesReader.readInto<Nonce>();
        this._refCount = bytesReader.readInto<CompactInt>();
        this._data = bytesReader.readInto<Data>();
    }

    eq(other: AccountInfo<Nonce, Data>): bool {
        return this.nonce.eq(other.nonce)
            && this.refCount.eq(other.refCount)
            && this.data.eq(other.data);
    }

    notEq(other: AccountInfo<Nonce, Data>): bool {
        return !this.eq(other);
    }
}