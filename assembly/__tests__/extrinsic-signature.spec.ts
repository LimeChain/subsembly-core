import { BytesReader } from "as-scale-codec";
import { ExtrinsicSignatureType, MockBuilder } from "./mock-builder";

describe("ExtrinsicSignature", () => {
    it("encodes ExtrinsicSignature", () => {
        const extSign = MockBuilder.getExtrinsicSignature();
        expect<u8[]>(extSign.instance.toU8a()).toStrictEqual(extSign.bytes);

        const extSign1 = MockBuilder.getExtrinsicSignature1();
        expect<u8[]>(extSign1.instance.toU8a()).toStrictEqual(extSign1.bytes);
    })

    it("decodes ExtrinsicSignature", () => {
        const extSign = MockBuilder.getExtrinsicSignature();
        const extSignDecoded = BytesReader.decodeInto<ExtrinsicSignatureType>(extSign.bytes);
        expect<bool>(extSign.instance.eq(extSignDecoded)).toStrictEqual(true);

        const extSign1 = MockBuilder.getExtrinsicSignature1();
        const extSignDecoded1 = BytesReader.decodeInto<ExtrinsicSignatureType>(extSign1.bytes);
        expect<bool>(extSign1.instance.eq(extSignDecoded1)).toStrictEqual(true);
    })
})