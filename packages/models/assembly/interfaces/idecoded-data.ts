import { Codec } from "as-scale-codec";

export interface IDecodedData<Codec>{
    getResult(): Codec;
    getInput(): u8[];
}