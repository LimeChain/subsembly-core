import { BytesReader, UInt128, UInt64 } from 'as-scale-codec';
import { AccountId, GenericExtrinsic, Signature } from '../models';
import { MockBuilder } from './mock-builder';
import { MockConstants } from './mock-constants';

export type UncheckedExtrinsic = GenericExtrinsic<AccountId, UInt128, UInt64, Signature>;

describe("Generic extrinsic tests", () => {
    it("should encode extrinsic", () => {
        const mockExt = MockBuilder.getSignedExtrinsicInstance();
        expect<u8[]>(mockExt.instance.toU8a()).toStrictEqual(mockExt.bytes);

        const mockExt1 = MockBuilder.getSignedExtrinsicInstance1();
        expect<u8[]>(mockExt1.instance.toU8a()).toStrictEqual(mockExt1.bytes);

        const mockExt2 = MockBuilder.getUnsignedExtrinsicInstance();
        expect<u8[]>(mockExt2.instance.toU8a()).toStrictEqual(mockExt2.bytes);

        const mockExt3 = MockBuilder.getUnsignedExtrinsicInstance1();
        expect<u8[]>(mockExt3.instance.toU8a()).toStrictEqual(mockExt3.bytes);
    })
    it("should decode signed extrinsics", () => {
        const mockExt = MockBuilder.getSignedExtrinsicInstance();
        const auraAuth = BytesReader.decodeInto<UncheckedExtrinsic>(mockExt.bytes);
        expect<bool>(auraAuth.isSigned()).toStrictEqual(true);
        expect<bool>(mockExt.instance.eq(auraAuth)).toStrictEqual(true);
        
        const mockExt1 = MockBuilder.getSignedExtrinsicInstance1();
        const balancesSet = BytesReader.decodeInto<UncheckedExtrinsic>(mockExt1.bytes);
        expect<bool>(balancesSet.isSigned()).toStrictEqual(true);
        expect<bool>(mockExt1.instance.eq(balancesSet)).toStrictEqual(true);
    })

    it("should decode unsigned extrinsics", () => {
        // Unsigned extrinsics
        const mockExt2 = MockBuilder.getUnsignedExtrinsicInstance();
        const unsigned = BytesReader.decodeInto<UncheckedExtrinsic>(mockExt2.bytes);
        expect<bool>(unsigned.eq(mockExt2.instance)).toStrictEqual(true);
        expect<bool>(unsigned.isSigned()).toStrictEqual(false);

        const mockExt3 = MockBuilder.getUnsignedExtrinsicInstance1();
        const unsigned1 = BytesReader.decodeInto<UncheckedExtrinsic>(MockConstants.UNSIGNED_BALANCES_ALICE_SET);
        expect<bool>(unsigned1.eq(mockExt3.instance)).toStrictEqual(true);
        expect<bool>(unsigned1.isSigned()).toStrictEqual(false);
    })

    
})

