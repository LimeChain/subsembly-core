import { Serialiser } from "../utils";
import { ext_hashing_twox_128_version_1, ext_hashing_twox_64_version_1 } from "./env";

export namespace Hashing {
    export function twoX128(data: u8[]): u8[] {
        const serialisedValue: i64 = Serialiser.serialiseResult(data);
        const hashedValue: i32 = ext_hashing_twox_128_version_1(serialisedValue);
        return Serialiser.deserialiseInput(hashedValue, 16);
    }

    export function twoX64(data: u8[]): u8[] {
        const serialisedValue: i32 = Serialiser.getPointerToBytes(data);
        const hashedValue: i64 = ext_hashing_twox_64_version_1(serialisedValue);
        return Serialiser.deserialiseInput(hashedValue, 8);
    }
}