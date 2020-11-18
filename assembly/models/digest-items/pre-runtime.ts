import { ByteArray, BytesReader } from "as-scale-codec";
import { BaseConsensusItem, DigestItem, DigestItemType } from ".";
import { DecodedData } from "..";

/**
 * @description Class representing PreRuntime Digest Item into the Substrate Runtime
 */
export class PreRuntime extends BaseConsensusItem {

    constructor(consensusEngineId: u8[] = [], value: ByteArray = new ByteArray()) {
        super(DigestItemType.PreRuntime, consensusEngineId, value);
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
     * @description Instanciates PreRuntime DigestItem from SCALE Encoded Bytes
     */
    static fromU8Array(input: u8[], index: i32 = 0): DecodedData<DigestItem> {
        assert(input.length > BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH, "PreRuntime Digest Item: Input bytes are invalid. EOF");
        const bytesReader = new BytesReader(input.slice(index));
        const consensusEngineId = bytesReader.readBytes(BaseConsensusItem.CONSENSUS_ENGINE_ID_LENGTH);

        const value = bytesReader.readInto<ByteArray>();

        return new DecodedData<DigestItem>(new PreRuntime(consensusEngineId, value), bytesReader.getLeftoverBytes());
    }

    /**
     * @description SCALE Encodes the PreRuntime DigestItem into u8[]
     */
    toU8a(): u8[] {
        let encoded: u8[] = [<u8>DigestItemType.PreRuntime];
        return encoded.concat(this.consensusEngineId)
            .concat(this.value.toU8a());
    }

}
