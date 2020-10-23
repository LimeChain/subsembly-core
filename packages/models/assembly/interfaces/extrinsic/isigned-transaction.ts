import { Codec } from "as-scale-codec";
import { IExtrinsic } from "./iextrinsic";

export interface ISignedTransaction extends IExtrinsic{
    getFrom(): Codec;
    getTo(): Codec;
    getAmount(): Codec;
    getNonce(): Codec;
    getSignature(): Codec;
}