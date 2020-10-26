import { Codec } from 'as-scale-codec';
import { IHeader } from './i-header';
import { IExtrinsic } from './extrinsic/i-extrinsic';

export interface IBlock extends Codec{
    /**
     * @description Get Header object of the Block
     */
    getHeader(): IHeader;
    /**
     * @description Get body (list of extrinsics) of the Block
     */
    getExtrinsics(): IExtrinsic[];
}