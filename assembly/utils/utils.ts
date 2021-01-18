import { ByteArray, Codec, CompactInt, Hash, ScaleString } from 'as-scale-codec';
import { Hashing } from '..';

export namespace Utils {
    /**
     * Returns new Array<u8> from Uint8 Typed array
     * @param typedArr 
     */
    export function toU8Array(typedArr: Uint8Array): u8[] {
        let res = new Array<u8>(2);
        for (let i = 0; i < typedArr.length; i++) {
            res[i] = typedArr[i];
        }
        return res;
    }

    /**
     * By given 2 arrays, checks whether their values are equal (strict equal by index)
     */
    export function areArraysEqual<T>(a: Array<T>, b: Array<T>): bool {
        if (a.length != b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Converts array of strings to array of bytes
     * @param args array of strings
     */
    export function stringsToBytes(args: string[], scale: bool = true): u8[]{
        let result: u8[] = [];
        for (let i=0; i<args.length ; i++){
            const strScale = new ScaleString(args[i]); 
            result = result.concat(scale ? strScale.toU8a() : strScale.values);
        }
        return result;
    }
    /**
     * 
     * @param byte default byte
     */
    export function getPopulatedHash(byte: u8): Hash {
        const hashBytes: u8[] = new Array<u8>(32);
        hashBytes.fill(byte);
        return Hash.fromU8a(hashBytes);
    }
    
    /**
     * Converts Array of SCALE types into u8[]
     */
    export function arrayToU8a(array: Array<Codec>): u8[]{
        let result: u8[] = [];
        for(let i: i32 = 0; i < array.length; i++){
            result.concat(array[i].toU8a());
        }
        return result;
    }

    /**
     * Encode length of the bytes
     * @param value value to encode
     */
    export function encodeCompact(value: u8[]): u8[] {
        return (new CompactInt(value.length)).toU8a().concat(value);
    }

    /**
     * Convert any Codec instance to hex string
     * @param value Codec instance
     */
    export function toHexString(value: u8[]): string {
        return new ByteArray(value).toHexString();
    }

    export function getHashedKey(prefix: string, key: string, suffix: Codec | null): u8[] {
        const prefixU8a = Utils.stringsToBytes([prefix], false);
        const hashedPrefix = Hashing.twoX128(prefixU8a);
        const keyU8a = Utils.stringsToBytes([key], false);
        const hashedKey = Hashing.twoX128(keyU8a);
        const hashedSuffix = suffix ? Hashing.twoX128(suffix.toU8a()) : [];
        return hashedPrefix.concat(hashedKey)
            .concat(hashedSuffix);
    }
}