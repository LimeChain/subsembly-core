import { BytesReader, Codec } from "as-scale-codec";
import { DecodedData } from ".";

/**
 * @description Class representing balance information for a given account 
 */
export class AccountData<B extends Codec> implements Codec {
    /**
     * Non-reserved part of the balance. It is the total pool what may in principle be transferred and reserved.
     */
    private free: B;

    /**
     * Balance which is reserved and may not be used at all.
     */
    private reserved: B;

    constructor(free: B = instantiate<B>(), reserved: B = instantiate<B>()) {
        this.free = free;
        this.reserved = reserved;
    }

    /**
    * @description SCALE Encodes the AccountData into u8[]
    */
    toU8a(): u8[] {
        return this.free.toU8a()
            .concat(this.reserved.toU8a());
    }

    /**
     * @description Sets new free value
     * @param newFree 
     */
    setFree(newFree: B): void {
        this.free = newFree;
    }

    /**
     * @description Sets new reserved value
     * @param newReserved
     */
    setReserved(newReserved: B): void {
        this.reserved = newReserved;
    }

    /**
     * @description Returns the free value
     */
    getFree(): B {
        return this.free;
    }

    /**
     * @description Returns the reserved value
     */
    getReserved(): B {
        return this.reserved;
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this.setFree(bytesReader.readInto<B>());
        this.setReserved(bytesReader.readInto<B>());
    }

    /**
     * @description Returns encoded byte length
     */
    encodedLength(): i32 {
        return this.free.encodedLength() + this.reserved.encodedLength();
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    eq(other: AccountData<B>): bool {
        return this.free == other.free && this.reserved == other.reserved;
    }
    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    notEq(other: AccountData<B>): bool {
        return !this.eq(other);
    }

    /**
     * @description Instanciates new AccountData object from SCALE encoded byte array
     * @param input - SCALE encoded AccountData
     * @param index - index to start decoding from
     */
    static fromU8Array<B extends Codec>(input: u8[], index: i32 = 0): DecodedData<AccountData<B>> {
        const bytesReader = new BytesReader(input.slice(index));

        const free = bytesReader.readInto<B>();
        const reserved = bytesReader.readInto<B>();

        const result = new AccountData(free, reserved);
        return new DecodedData<AccountData<B>>(result, bytesReader.getLeftoverBytes());
    }
}