import { Codec } from 'as-scale-codec';
import { IExtrinsic } from './extrinsic/extrinsic';
import { IHeader } from './header';

/**
 * @description Interface for Block model
 */
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