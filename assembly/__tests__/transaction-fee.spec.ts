import { u128 } from 'as-bignum';
import { UInt128, UInt64 } from 'as-scale-codec';
import { WeightToFeeCoefficient, WeightToFeePolynomial } from '../models';

export type Weight = UInt64;
export type Balance = UInt128;

describe("Weight to fee testing", () => {
    it("Polynomial works", () => {
        // p(x) = 2 * x^2 + 1.5 * x + 5.75
        const coeffs: WeightToFeeCoefficient[] = [
            new WeightToFeeCoefficient(2, 0, false, 2),
            new WeightToFeeCoefficient(1, 0.5, false, 1),
            new WeightToFeeCoefficient(5, 0.75, false, 0)
        ];
        const poly = new WeightToFeePolynomial<Balance>(coeffs);
        const fee = poly.calc<Weight>(instantiate<Weight>(1));
        expect<Balance>(fee).toStrictEqual(instantiate<Balance>(u128.fromU32(10)));
        
        const coeffs1: WeightToFeeCoefficient[] = [
            new WeightToFeeCoefficient(3, 0.11, false, 3),
            new WeightToFeeCoefficient(10, 0.33, true, 2),
            new WeightToFeeCoefficient(11, 0.5, false, 1),
            new WeightToFeeCoefficient(4, 0.3, true, 0)
        ];
        const poly1 = new WeightToFeePolynomial<Balance>(coeffs1);
        const fee1 = poly1.calc<Weight>(instantiate<Weight>(1));
        expect<Balance>(fee1).toStrictEqual(instantiate<Balance>(u128.One));
    })

})