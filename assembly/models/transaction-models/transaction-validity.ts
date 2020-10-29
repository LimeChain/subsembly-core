export class TransactionValidity{
    public valid: bool;
    public error: u8[];
    public message: string;

    constructor(valid: bool, error: u8[], message: string){
        this.valid = valid;
        this.error = error;
        this.message = message;
    }
}