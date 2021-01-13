import { BytesReader } from "as-scale-codec";
import { ExtrinsicEra } from "../models";
import { MockBuilder } from "./mock-builder";

describe("ExtrinsicEra tests", () => {
    it("should encode ExtrinsicEra", () => {
        const mockEra = MockBuilder.getExtrinsicEraInstance();
        expect<u8[]>(mockEra.instance.toU8a()).toStrictEqual(mockEra.bytes);

        const mockEra1 = MockBuilder.getExtrinsicEraInstance1();
        expect<u8[]>(mockEra1.instance.toU8a()).toStrictEqual(mockEra1.bytes);

        const mockImmortalEra = MockBuilder.getExtrinsicEraImmortal();
        expect<u8[]>(mockImmortalEra.instance.toU8a()).toStrictEqual(mockImmortalEra.bytes);
    })

    it("should decode ExtrinsicEra", () => {
        const mockEra = MockBuilder.getExtrinsicEraInstance3();
        const era = BytesReader.decodeInto<ExtrinsicEra>(mockEra.bytes);
        trace(era.period.toString() + " " + era.phase.toString());
        expect<bool>(mockEra.instance.eq(era)).toStrictEqual(true);

        const mockEra2 = MockBuilder.getExtrinsicEraInstance();
        const era2 = BytesReader.decodeInto<ExtrinsicEra>(mockEra2.bytes);
        expect<bool>(mockEra2.instance.eq(era2)).toStrictEqual(true);

        const mockImmortalEra = MockBuilder.getExtrinsicEraImmortal();
        const eraImmortal = BytesReader.decodeInto<ExtrinsicEra>(mockImmortalEra.bytes);
        expect<bool>(mockImmortalEra.instance.eq(eraImmortal)).toStrictEqual(true);
    })
})