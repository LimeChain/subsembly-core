import { IDecodedData } from "./interfaces/idecoded-data";
import { Codec } from 'as-scale-codec';
/**
 * Class used to return the result of decoding an object, together with a sliced array of bytes that are left for decoding
 */
export class DecodedData<Codec> implements IDecodedData<Codec>{

    /**
     * The result of the decoding of an object
     */
    public result: Codec;
    /**
     * The array of bytes left to be decoded
     */
    public input: u8[];

    getResult(): Codec{
        return this.result;
    }

    getInput(): u8[]{
        return this.input;
    }

    constructor(result: Codec, input: u8[]) {
        this.result = result;
        this.input = input;
    }
}