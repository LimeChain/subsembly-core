import { ext_crypto_ed25519_verify_version_1, ext_crypto_sr25519_verify_version_2 } from '.';
import { AccountId, Signature } from '../models';
import { Serialiser } from '../utils';

/**
 * Signature types
 */
export enum SignatureTypes {
    ed25519 = 0,
    sr25519 = 1
}

/**
 * @description Useful crypto related functions
 */
export namespace Crypto{
    /**
     * @description Verifies the message and signature of the extrinsic  
     * @param signature 
     * @param msg message to be verified
     * @param sender 
     */
    export function verifySignature(signature: Signature, msg: u8[], sender: AccountId, type: SignatureTypes): bool{
        const serialisedSign: i32 = Serialiser.getPointerToBytes(signature.getValue());
        const serialiseMsg: u64 = Serialiser.serialiseResult(msg);
        const serialisedSender: i32 = Serialiser.getPointerToBytes(sender.getAddress());
        
        switch (type) {
            case SignatureTypes.ed25519: {
                const result: i32 = ext_crypto_ed25519_verify_version_1(serialisedSign, serialiseMsg, serialisedSender);
                return result as bool;                
            }
            case SignatureTypes.sr25519: {
                const result: i32 = ext_crypto_sr25519_verify_version_2(serialisedSign, serialiseMsg, serialisedSender);
                return result as bool; 
            }
            default: {
                return false;
            }
        }
    }
}