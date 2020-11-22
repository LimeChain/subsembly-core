import { Codec } from 'as-scale-codec';

/**
 * @description Interface for AccountId
 */
export interface IAccountId extends Codec{
    /**
     * @description Get address of the accountId
     */
    getAddress(): u8[];
}