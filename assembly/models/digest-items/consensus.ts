import { DigestItem, DigestItemType, BaseConsensusItem } from ".";
import { DecodedData } from '..';
import { ByteArray, BytesReader } from "as-scale-codec";

/**
 * Class representing Consensus Digest Item into the Substrate Runtime
 */
export class Consensus extends BaseConsensusItem {
   
    constructor(consensusEngineId: u8[] = [], value: ByteArray = new ByteArray()) {
        super(DigestItemType.Consensus, consensusEngineId, value);
    }
    
    /**
     * @description Non static constructor from bytes
     * @param bytes SCALE encoded bytes
     * @param index starting index
     */
    populateFromBytes(bytes: u8[], index: i32 = 0): void{
        const bytesReader = new BytesReader(bytes.slice(index));
        this.consensusEngineId = bytesReader.readBytes(BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);
        this.value = bytesReader.readInto<ByteArray>();
    }
    
    /**
     * Instanciates Consensus DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[]): DecodedData<DigestItem> {
        assert(input.length > BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH, "Consensus Digest Item: Input bytes are invalid. EOF");

        const consensusEngineId = input.slice(0, BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);
        input = input.slice(BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);

        const value = ByteArray.fromU8a(input);
        input = input.slice(value.encodedLength());

        return new DecodedData<DigestItem>(new Consensus(consensusEngineId, value), input);
    }

    /**
     * SCALE Encodes the Consensus DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.Consensus];
        return encoded.concat(this.consensusEngineId)
            .concat(this.value.toU8a());
    }
}
