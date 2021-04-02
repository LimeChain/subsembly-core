import { u128 } from 'as-bignum';
import { Codec } from "as-scale-codec";
/**
 * One coefficient and its position in the `WeightToFeePolynomial`.
 * One term of polynomial is calculated as:
 * ```ignore
 * coeff_integer * x^(degree) + coeff_frac * x^(degree)
 * ```
 * The `negative` value encodes whether the term is added or substracted from the
 * overall polynomial result.
 */
export class WeightToFeeCoefficient {
    public coeffInteger: u64;
    public coeffFrac: f64;
    public negative: bool;
    public degree: u8;

    constructor(coeffInteger: u64, coeffFrac: f64, negative: bool, degree: u8){
        this.coeffInteger = coeffInteger;
        this.coeffFrac = coeffFrac;
        this.negative = negative;
        this.degree = degree;
    }
}

/**
 * A class that describes the weight to fee calculation as polynomial.
 * An implementor should only implement the `polynomial` function.
 */
export class WeightToFeePolynomial<Balance extends Codec> {
    /**
     * Coefficients of weight to fee polynomial
     */
    public coefficients: WeightToFeeCoefficient[];

    constructor(coefficients: WeightToFeeCoefficient[] = []) {
        this.coefficients = coefficients;
    }

    /**
     * Calculates the fee from the passed `weight` according to the `polynomial`.
     * This should not be overriden in most circumstances. Calculation is done in the 
     * `Balance` type and never overflows. All evaluation is saturating.
     * @param weight transaction weight
     */
    calc<Weight extends Codec>(weight: Weight): Balance {    
        let acc: u64 = 0;
        for (let i: i32 = 0; i < this.coefficients.length; i++){
            let w: u64 = (<u64>weight.unwrap()) ** <u64>this.coefficients[i].degree;
            const frac: u64 = <u64>Math.round(<f64>this.coefficients[i].coeffFrac * <f64>w);
            const integer: u64 = <u64>this.coefficients[i].coeffInteger * <u64>w;
            
            if(this.coefficients[i].negative){
                acc -= <u64>frac;
                acc -= <u64>integer;
            }
            else {
                acc += <u64>frac;
                acc += <u64>integer;
            }
        }
        return instantiate<Balance>(u128.fromU64(acc));
    }
}