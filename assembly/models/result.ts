import { Codec } from "as-scale-codec";

export class Result<V extends Codec> {
    private ok: V | null;
    private err: u8[] | null;

    constructor(ok: V| null, err: u8[] | null){
        this.ok = ok;
        this.err = err;
    }

    toU8a(): u8[] {
        return this.ok ? <u8[]>[0].concat(this.ok.toU8a()) : <u8[]>[1].concat(this.err ? this.err : []);
    }
}