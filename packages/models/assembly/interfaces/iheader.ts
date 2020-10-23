import { Codec } from 'as-scale-codec';

/**
 * Header interface
 */
export interface IHeader extends Codec{
    getParentHash(): Codec;
    getExtrinsicsRoot(): Codec;
    getNumber(): Codec;
    getStateRoot(): Codec;
}