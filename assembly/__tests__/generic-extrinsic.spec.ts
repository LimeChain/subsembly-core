import { BytesReader, CompactInt, UInt128, UInt64 } from 'as-scale-codec';
import { AccountId, Call, Era, ExtrinsicEra, ExtrinsicSignature, GenericExtrinsic, Signature, SignedExtension } from '../models';
import { MockConstants } from './mock-constants';

export type UncheckedExtrinsic = GenericExtrinsic<AccountId, UInt128, UInt64, Signature>;

describe("Generic extrinsic tests", () => {
    it("should decode", () => {
        const auraAuth = BytesReader.decodeInto<UncheckedExtrinsic>(MockConstants.SIGNED_AURA_SLOT_DURATION);
        expect(auraAuth.isSigned()).toStrictEqual(true);
        const signer = new AccountId(AccountId.ALICE);
        const signature = new Signature(MockConstants.SIGNATURE_SLOT_DURATION);
        const method = new Call([1, 0], []);
        const mortalEra = new ExtrinsicEra(Era.Mortal, 64, 0);
        const signedExtension = new SignedExtension(mortalEra, new CompactInt(0), new CompactInt(0));
        const ext = instantiate<UncheckedExtrinsic>(method, new ExtrinsicSignature(false, signer, signature, signedExtension));
        expect<bool>(ext.eq(auraAuth)).toStrictEqual(true);
    })
})

