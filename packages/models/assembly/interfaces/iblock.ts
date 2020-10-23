import { Codec } from 'as-scale-codec/assembly/interfaces/Codec';
import { IHeader } from './iheader';
import { IExtrinsic } from './extrinsic/iextrinsic';

export interface IBlock extends Codec{
    getHeader(): IHeader;
    getExtrinsics(): IExtrinsic[];
}