import { BytesReader } from "as-scale-codec";
import { SignedExtension } from "../models";
import { MockBuilder } from "./mock-builder";

describe("SignedExtension tests", () => {
    it("encodes SignedExtension", () => {
        const mockSignExt = MockBuilder.getSignedExtensionInstance();
        expect<u8[]>(mockSignExt.instance.toU8a()).toStrictEqual(mockSignExt.bytes);

        const mockSignExt1 = MockBuilder.getSignedExtensionInstance1();
        expect<u8[]>(mockSignExt1.instance.toU8a()).toStrictEqual(mockSignExt1.bytes);
    })

    it("decodes SignedExtension", () => {
        const mockSignExt1 = MockBuilder.getSignedExtensionInstance();
        const signExt1 = BytesReader.decodeInto<SignedExtension>(mockSignExt1.bytes);
        expect<bool>(mockSignExt1.instance.eq(signExt1)).toStrictEqual(true);

        const mockSignExt2 = MockBuilder.getSignedExtensionInstance1();
        const signExt2 = BytesReader.decodeInto<SignedExtension>(mockSignExt2.bytes);
        expect<bool>(mockSignExt2.instance.eq(signExt2)).toStrictEqual(true);
    })
})