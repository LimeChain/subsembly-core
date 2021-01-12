import { Era, ExtrinsicEra } from "../models";

describe("ExtrinsicEra tests", () => {
    it("should encode ExtrinsicEra", () => {
        const era = new ExtrinsicEra(Era.Mortal, 64, 0);
        expect<u8[]>(era.toU8a()).toStrictEqual(<u8[]>([5, 0]));

        const era1 = new ExtrinsicEra(Era.Mortal, 64, 19);
        expect<u8[]>(era1.toU8a()).toStrictEqual(<u8[]>([53, 1]));
    })
})