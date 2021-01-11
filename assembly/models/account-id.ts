import { BytesReader, Codec } from "as-scale-codec";
import { DecodedData } from ".";
import { Utils } from "../utils";

/**
 * @description Thin wrapper of SCALE Hash that represents Account ID (SS58)
 */
export class AccountId implements Codec {
    public static ALICE: u8[] = [
        212,53,147,199,21,253,211,28,97,20,26,189,4,169,159,214,130,
        44,133,88,133,76,205,227,154,86,132,231,165,109,162,125
    ];
    /**
     * Length of Address in Bytes
     */
    public static readonly ADDRESS_LENGTH:i32 = 32;

    /**
     * Bytes 32 representing the public address of the Account
     */
    private address: u8[];

    constructor(bytes: u8[] = AccountId.ALICE) {
        assert(bytes.length == AccountId.ADDRESS_LENGTH, "AccountId: invalid bytes length provided.");
        this.address = new Array<u8>();
        this.address = this.address.concat(bytes);
    }

    /**
     * @description Returns the Bytes that represent the address 
     */
    getAddress(): u8[] {
        return this.address;
    }

    /**
     * @description Returns the number of bytes used for encoding AccountId
     */
    encodedLength(): i32 {
        return this.address.length;
    }

    /**
     * @description Converts instance to SCALE encoded bytes
     */
    toU8a(): u8[]{
        return this.address;
    }

    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        assert(bytes.length - index >= AccountId.ADDRESS_LENGTH, "AccountId: invalid bytes length provided.");
        this.address = new Array<u8>();
        this.address = this.address.concat(bytes.slice(index, AccountId.ADDRESS_LENGTH));
    }

    /**
     * @description Overloaded == operator
     * @param a 
     * @param b 
     */
    eq(other: AccountId): bool {
        return Utils.areArraysEqual(this.getAddress(), other.getAddress());
    }

    /**
     * @description Overloaded != operator
     * @param a 
     * @param b 
     */
    notEq(other: AccountId): bool {
        return this.eq(other);
    }

    /**
     * Instanciates new Account ID from Bytes Array
     * @param input 
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<AccountId> {
        assert(input.length - index >= AccountId.ADDRESS_LENGTH, "AccountId: Invalid bytes length provided. EOF");
        const bytesReader = new BytesReader(input.slice(index));
        const accId = new AccountId(bytesReader.readBytes(AccountId.ADDRESS_LENGTH));
        return new DecodedData<AccountId>(accId, bytesReader.getLeftoverBytes());
    }

    @inline @operator('==')
    static eq(a: AccountId, b: AccountId): bool{
        return a.eq(b);
    }

    @inline @operator('!=')
    static notEq(a: AccountId, b: AccountId): bool{
        return a.notEq(b);
    }
}