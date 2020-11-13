import { BytesReader, Codec } from "as-scale-codec";
import { DecodedData } from "."
import { Utils } from "../utils";

/**
 * Thin wrapper of SCALE Hash that represents Account ID (SS58)
 */
export class AccountId implements Codec {

    /**
     * Length of Address in Bytes
     */
    public static readonly ADDRESS_LENGTH:i32 = 32;

    /**
     * Bytes 32 representing the public address of the Account
     */
    private address: u8[];

    constructor(bytes: u8[] = []) {
        assert(bytes.length == AccountId.ADDRESS_LENGTH, "AccountId: invalid bytes length provided.");
        this.address = new Array<u8>();
        this.address = this.address.concat(bytes);
    }

    /**
     * Returns the Bytes that represent the address 
     */
    getAddress(): u8[] {
        return this.address;
    }

    /**
     * Returns the number of bytes used for encoding AccountId
     */
    encodedLength(): i32 {
        return this.address.length;
    }

    toU8a(): u8[]{
        return this.address;
    }
    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        assert(bytes.length - index == AccountId.ADDRESS_LENGTH, "AccountId: invalid bytes length provided.");
        this.address = new Array<u8>();
        this.address = this.address.concat(bytes.slice(index, AccountId.ADDRESS_LENGTH));
    }
    /**
     * Instanciates new Account ID from Bytes Array
     * @param input 
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<AccountId> {
        assert(input.length >= AccountId.ADDRESS_LENGTH, "AccountId: Invalid bytes length provided. EOF");
        const bytesReader = new BytesReader(input.slice(index));
        const accId = new AccountId(bytesReader.readBytes(AccountId.ADDRESS_LENGTH));
        return new DecodedData<AccountId>(accId, bytesReader.getLeftoverBytes());
    }

    @inline @operator('==')
    static eq(a: AccountId, b: AccountId): bool {
        return Utils.areArraysEqual(a.getAddress(), b.getAddress());
    }

    @inline @operator('!=')
    static notEq(a: AccountId, b: AccountId): bool {
        return !Utils.areArraysEqual(a.getAddress(), b.getAddress());
    }

}