import { CompactInt, UInt32 } from "as-scale-codec";

/**
 * @description Vector of pairs of ApiId and u32 for version
 */
export class SupportedAPIs {
    
    /**
     * Vector of pairs of ApiId
     */
    private apis: Map<u8[], UInt32>

    constructor() {
        this.apis = new Map<u8[], UInt32>();
    }

    /**
     * @description Adds new API in the supported APIs Vector
     * @param apiId - the ID of the API
     * @param version - the version of the supported API
     */
    addAPI(apiId: u8[], version: u32): void {
        this.apis.set(apiId, new UInt32(version));
    }

    /**
     * @description SCALE Encodes the SupportedAPIs into u8[]
     */
    toU8a(): u8[] {
        
        const keys = this.apis.keys();
        const values = this.apis.values();

        let result = new Array<u8>();
        // Encode the length of the supported APIs
        result = result.concat(new CompactInt(this.apis.size).toU8a());

        for (let i = 0; i < this.apis.size; i++) {
            result = result.concat(keys[i]);
            result = result.concat(values[i].toU8a());
        }
        return result;
    }

}