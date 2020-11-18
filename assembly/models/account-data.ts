import { BytesReader, UInt128 } from "as-scale-codec";
import { DecodedData, IAccountData } from ".";

/**
 * @description Class representing balance information for a given account 
 */
export class AccountData implements IAccountData {

    /**
     * Non-reserved part of the balance. It is the total pool what may in principle be transferred and reserved.
     */
    private free: UInt128;

    /**
     * Balance which is reserved and may not be used at all.
     */
    private reserved: UInt128;

    constructor(free: UInt128 = UInt128.Zero, reserved: UInt128 = UInt128.Zero) {
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
    setFree(newFree: UInt128): void {
        this.free = newFree;
    }

    /**
     * @description Sets new reserved value
     * @param newReserved
     */
    setReserved(newReserved: UInt128): void {
        this.reserved = newReserved;
    }

    /**
     * @description Returns the free value
     */
    getFree(): UInt128 {
        return this.free;
    }

    /**
     * @description Returns the reserved value
     */
    getReserved(): UInt128 {
        return this.reserved;
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void {
        const bytesReader = new BytesReader(bytes.slice(index));
        this.setFree(bytesReader.readInto<UInt128>());
        this.setReserved(bytesReader.readInto<UInt128>());
    }

    /**
     * @description Returns encoded byte length
     */
    encodedLength(): i32 {
        return this.free.encodedLength() + this.reserved.encodedLength();
    }

    /**
     * @description Instanciates new Default AccountData object
     */
    static getDefault(): AccountData {
        return new AccountData(UInt128.Zero, UInt128.Zero);
    }

    /**
     * @description Instanciates new AccountData object from SCALE encoded byte array
     * @param input - SCALE encoded AccountData
     * TODO - avoid slicing the aray for better performance
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<AccountData> {
        const bytesReader = new BytesReader(input.slice(index));

        const free = bytesReader.readInto<UInt128>();
        const reserved = bytesReader.readInto<UInt128>();

        const result = new AccountData(free, reserved);
        return new DecodedData<AccountData>(result, bytesReader.getLeftoverBytes());
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    @inline @operator('==')
    static eq(a: AccountData, b: AccountData): bool {
        return a.free == b.free && a.reserved == b.reserved;
    }
    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    @inline @operator('!=')
    static notEq(a: AccountData, b: AccountData): bool {
        return !AccountData.eq(a, b);
    }
}