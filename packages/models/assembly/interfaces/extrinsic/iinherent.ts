import { Codec } from "as-scale-codec";
import { IExtrinsic } from "./iextrinsic";

export interface IInherent extends IExtrinsic{
    getCallIndex(): u8[];
    getPrefix(): u8;
    getVersion(): u8;
    getArgument(): Codec;
}