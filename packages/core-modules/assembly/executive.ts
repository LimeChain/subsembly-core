import { 
    IBlock, IHeader, ISignature,
    InherentData, IExtrinsic, ISignedTransaction,
    Extrinsic, Inherent, DecodedData,
    ValidTransaction, TransactionTag, ResponseCodes,
    ExtrinsicType
} from '@as-substrate/models';
import { Timestamp } from '@as-substrate/timestamp-module';
import { AuraModule } from '@as-substrate/aura-module';
import { Utils } from '@as-substrate/core-utils';
import { AccountId, BalancesModule } from '@as-substrate/balances-module';
import { CompactInt, Bool, UInt64, Bytes, Hash } from 'as-scale-codec';
import { System, Log, Crypto } from '.';

type BlockNumber = CompactInt;
type HashType = Hash;
type NonceType = UInt64;
export namespace Executive{
    /**
     * Calls the System function initializeBlock()
     * @param header Header instance
     */
    export function initializeBlock(header: IHeader): void{
        System.initialize(header);
    }

    /**
     * Performs necessary checks for Block execution
     * @param block Block instance
     */
    export function initialChecks(block: IBlock): void{
        let header: IHeader = block.getHeader();
        let n: BlockNumber = <BlockNumber>header.getNumber();
        // check that parentHash is valid
        const previousBlock: CompactInt = new CompactInt(n.value - 1);
        const parentHash: Hash = System.getHashAtBlock(previousBlock);

        if(n.value == 0 && parentHash != header.getParentHash()){
            Log.error("Initial checks: Parent hash should be valid.");
            throw new Error("Executive: Initial checks for block execution failed");
        }
    }

    /**
     * Final checks before including block in the chain
     * @param header 
     */
    export function finalChecks(header: IHeader): void{
        System.computeExtrinsicsRoot();
        let newHeader = System.finalize();
        let storageRoot = newHeader.getStateRoot();
        if(<HashType>header.getStateRoot() != <HashType>storageRoot){
            Log.error("Storage root must match that calculated");
            throw new Error("Executive: Final checks for block execution failed");
        }
    }



    /**
     * Actually execute all transactions for Block
     * @param block Block instance
     */
    export function executeBlock(block: IBlock): void{
        Executive.initializeBlock(block.getHeader());
        Executive.initialChecks(block);

        Executive.executeExtrinsicsWithBookKeeping(block.getExtrinsics());
        Executive.finalChecks(block.getHeader());
    }
    /**
     * Finalize the block - it is up the caller to ensure that all header fields are valid
	 * except state-root.
     */
    export function finalizeBlock(): IHeader {
        System.noteFinishedExtrinsics();
        System.computeExtrinsicsRoot();
        return System.finalize();
    }
    /**
     * creates inherents from internal modules
     * @param data inherents
     */
    export function createExtrinsics(data: InherentData): u8[] {
        const timestamp: Inherent = Timestamp.createInherent(data);
        const aura = AuraModule.createInherent(data);
        return System.ALL_MODULES.concat(timestamp.toU8a()).concat(aura);
    }

    /**
     * Apply Extrinsics
     * @param ext extrinsic
     */
    export function applyExtrinsic(ext: u8[]): u8[] {
        const encodedLen = Bytes.decodeCompactInt(ext);
        const result = Executive.applyExtrinsicWithLen(ext, encodedLen.value as u32);
        // if applying extrinsic succeeded, notify System about it
        if(Utils.areArraysEqual(result, ResponseCodes.SUCCESS)){
            System.noteAppliedExtrinsic(ext);
        }
        return result;
    }
    
    /**
     * 
     * @param ext extrinsic
     * @param encodedLen length
     * @param encoded encoded extrinsic
     */
    export function applyExtrinsicWithLen(ext: u8[], encodedLen: u32): u8[]{
        const extrinsic: DecodedData<Extrinsic> = Extrinsic.fromU8Array(ext);

        if(Extrinsic.isInherent(extrinsic.result)){
            const inherent: Inherent = <Inherent>extrinsic.result;
            return Timestamp.applyInherent(inherent);
        }
        const signedTransaction: ISignedTransaction = <ISignedTransaction>extrinsic.getResult();
        return BalancesModule.applyExtrinsic(signedTransaction);
    }

    /**
     * Execute given extrinsics and take care of post-extrinsics book-keeping
     * @param extrinsics byte array of extrinsics 
     */
    export function executeExtrinsicsWithBookKeeping(extrinsics: IExtrinsic[]): void{
        for(let i=0; i<extrinsics.length; i++){
            Executive.applyExtrinsic(extrinsics[i].toU8a());
        }
        System.noteFinishedExtrinsics();
    }

    /**
     * Initial transaction validation
     * @param source source of the transaction (external, inblock, etc.)
     * @param utx transaction
     */
    export function validateTransaction(utx: ISignedTransaction): u8[] {
        const from: AccountId = AccountId.fromU8Array(utx.getFrom().toU8a()).getResult();
        const transfer = utx.getTransferBytes();

        if(!Crypto.verifySignature(<ISignature>utx.getSignature(), transfer, from)){
            Log.error("Validation error: Invalid signature");
            return ResponseCodes.INVALID_SIGNATURE;
        }   
        const nonce = System.accountNonce(from);
        const utxNonce: NonceType = <NonceType>utx.getNonce();
        if (<u64>nonce.value >= <u64>utxNonce.value){
            Log.error("Validation error: Nonce value is less than or equal to the latest nonce");
            return ResponseCodes.NONCE_TOO_LOW;
        }
        const validated = BalancesModule.validateTransaction(utx);
        if(!validated.valid){
            Log.error(validated.message);
            return validated.error;
        }

        /**
         * If all the validations are passed, construct validTransaction instance
         */
        const priority: UInt64 = new UInt64(<u64>ExtrinsicType.SignedTransaction);
        const requires: TransactionTag[] = [];
        const provides: TransactionTag[] = [new TransactionTag(from, <NonceType>utx.getNonce())];
        const longevity: UInt64 = new UInt64(64);
        const propogate: Bool = new Bool(true);
        const validTransaction = new ValidTransaction(
            priority,
            requires,
            provides,
            longevity,
            propogate
        );
        return validTransaction.toU8a();
    }

    /**
     * module hooks
     */
    export function onFinalize(): void{
        Log.info("onInitialize() called");
    }
}
