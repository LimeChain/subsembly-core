import { Codec } from "as-scale-codec";

export interface ISignedTransaction {
    getFrom(): Codec;
    getTo(): Codec;
    getAmount(): Codec;
    getNonce(): Codec;
    getSignature(): Codec;
    getTransferBytes(): u8[];
}