import { Codec } from 'as-scale-codec';
import { DigestItem } from '../digest-items';

/**
 * Header interface
 */
export interface IHeader extends Codec {
    /**
     * @description Get parent hash of the Header
     */
    getParentHash<T extends Codec>(): T;
    /**
     * @description Get extrinsicsRoot property of the Header
     */
    getExtrinsicsRoot<T extends Codec>(): T;
    /**
     * @description Get Block's number
     */
    getNumber<T extends Codec>(): T;
    /**
     * @description Get the state root of the Header
     */
    getStateRoot<T extends Codec>(): T;
    /**
     * @description Get the array of digests of the Header
     */
    getDigests(): DigestItem[];
}