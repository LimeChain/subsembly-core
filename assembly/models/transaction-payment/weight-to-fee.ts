import { Bool, Codec } from "as-scale-codec";
import { UnwrappableCodec } from "as-scale-codec/assembly/interfaces/UnwrappableCodec";

export class WeightToFeeCoefficient<Balance> {
    public coeffInteger: Balance;
    public coeffFrac: f64;
    public negative: Bool;
    public degree: u8;

    constructor(coeffInteger: Balance, coeffFrac: f64, negative: Bool, degree: u8){
        this.coeffInteger = coeffInteger;
        this.coeffFrac = coeffFrac;
        this.negative = negative;
        this.degree = degree;
    }
}

export class WeightToFeePolynomial {
    static calc<Weight extends UnwrappableCodec<Codec>>(weight: Weight): Weight{
        
    }
}