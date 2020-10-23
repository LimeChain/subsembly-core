import { Codec } from "as-scale-codec";

export interface IExtrinsic extends Codec{
    getTypeId(): u64;
}