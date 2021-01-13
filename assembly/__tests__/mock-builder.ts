import { CompactInt, UInt128, UInt64 } from "as-scale-codec";
import { AccountId, Call, Era, ExtrinsicEra, ExtrinsicSignature, GenericExtrinsic, Signature, SignedExtension } from "../models";
import { MockConstants } from "./mock-constants";
import { MockResult } from "./mock-result";

export type UncheckedExtrinsic = GenericExtrinsic<AccountId, UInt128, UInt64, Signature>;
export type ExtrinsicSignatureType = ExtrinsicSignature<AccountId, Signature>;

export namespace MockBuilder {
    export function getSignedExtrinsicInstance(): MockResult<UncheckedExtrinsic> {
        const signer = new AccountId(MockConstants.ALICE);
        const signature = new Signature(MockConstants.SIGNATURE_SLOT_DURATION);
        const method = new Call([1, 0], []);
        const mortalEra = new ExtrinsicEra(Era.Mortal, 64, 0);
        const signedExtension = new SignedExtension(mortalEra, new CompactInt(0), new CompactInt(0));
        const ext = instantiate<UncheckedExtrinsic>(method, new ExtrinsicSignature(false, signer, signature, signedExtension));
        return new MockResult<UncheckedExtrinsic>(ext, MockConstants.SIGNED_AURA_SLOT_DURATION);
    }

    export function getSignedExtrinsicInstance1(): MockResult<UncheckedExtrinsic> {
        const signer = new AccountId(MockConstants.ALICE);
        const signature1 = new Signature(MockConstants.SIGNATURE_SET_BALANCE);
        const method1 = new Call([2, 0], MockConstants.BALANCES_SET_ARGUMENT);
        const mortalEra1 = new ExtrinsicEra(Era.Mortal, 64, 53);
        const signedExtension1 = new SignedExtension(mortalEra1, new CompactInt(0), new CompactInt(1));
        const ext1 = instantiate<UncheckedExtrinsic>(method1, new ExtrinsicSignature(false, signer, signature1, signedExtension1));
        return new MockResult<UncheckedExtrinsic>(ext1, MockConstants.SIGNED_BALANCES_ALICE_SET_BALANCE);
    }

    export function getUnsignedExtrinsicInstance(): MockResult<UncheckedExtrinsic> {
        const call = new Call([1, 1], []);
        const unsigned = instantiate<UncheckedExtrinsic>(call);
        return new MockResult<UncheckedExtrinsic>(unsigned, MockConstants.UNSIGNED_AURA_AUTHORITIES);
    }

    export function getUnsignedExtrinsicInstance1(): MockResult<UncheckedExtrinsic> {
        const call = new Call([2, 0], MockConstants.BALANCES_SET_ARGUMENT);
        const unsigned = instantiate<UncheckedExtrinsic>(call);
        return new MockResult<UncheckedExtrinsic>(unsigned, MockConstants.UNSIGNED_BALANCES_ALICE_SET);
    }

    export function getExtrinsicEraInstance(): MockResult<ExtrinsicEra> {
        const era = new ExtrinsicEra(Era.Mortal, 64, 0);
        return new MockResult<ExtrinsicEra>(era, MockConstants.ERA_1);
    }

    export function getExtrinsicEraInstance1(): MockResult<ExtrinsicEra> {
        const era = new ExtrinsicEra(Era.Mortal, 64, 53);
        return new MockResult<ExtrinsicEra>(era, MockConstants.ERA_2);
    }

    
    export function getExtrinsicEraInstance3(): MockResult<ExtrinsicEra> {
        const era = new ExtrinsicEra(Era.Mortal, 64, 19);
        return new MockResult<ExtrinsicEra>(era, MockConstants.ERA_3);
    }

    export function getExtrinsicEraImmortal(): MockResult<ExtrinsicEra> {
        const era = new ExtrinsicEra(Era.Immortal);
        return new MockResult<ExtrinsicEra>(era, [0]);
    }

    export function getSignedExtensionInstance(): MockResult<SignedExtension> {
        const signedExt = new SignedExtension(MockBuilder.getExtrinsicEraInstance().instance, new CompactInt(0), new CompactInt(1));
        return new MockResult<SignedExtension>(signedExt, MockConstants.SIGNED_EXT_1);
    }

    export function getSignedExtensionInstance1(): MockResult<SignedExtension> {
        const signedExt = new SignedExtension(MockBuilder.getExtrinsicEraInstance3().instance, new CompactInt(3), new CompactInt(104));
        return new MockResult<SignedExtension>(signedExt, MockConstants.SIGNED_EXT_2);
    }

    export function getExtrinsicSignature(): MockResult<ExtrinsicSignatureType>{
        const extSign = instantiate<ExtrinsicSignatureType>(
            false,
            new AccountId(MockConstants.ALICE),
            new Signature(MockConstants.SIGNATURE_SLOT_DURATION),
            new SignedExtension(new ExtrinsicEra(Era.Mortal, 64, 21), new CompactInt(0), new CompactInt(3))
        );
        return new MockResult<ExtrinsicSignatureType>(extSign, MockConstants.EXT_SIGNATURE_1);
    }

    export function getExtrinsicSignature1(): MockResult<ExtrinsicSignatureType> {
        const extSign = instantiate<ExtrinsicSignatureType>(
            false,
            new AccountId(MockConstants.ALICE),
            new Signature(MockConstants.SIGNATURE_SET_BALANCE),
            new SignedExtension(new ExtrinsicEra(Era.Mortal, 64, 51), new CompactInt(104), new CompactInt(168))
        );
        return new MockResult<ExtrinsicSignatureType>(extSign, MockConstants.EXT_SIGNATURE_2);
    }
}