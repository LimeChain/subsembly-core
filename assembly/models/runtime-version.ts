import { ScaleString, UInt32 } from "as-scale-codec";
import { SupportedAPIs } from ".";


/**
 * @description Version module for the Substrate runtime
 */
export class RuntimeVersion {

    /**
     * Identifies the different runtimes
     */
    private _specName: ScaleString;

    /**
     * Name of the implementation of the spec. This is of little consequence for the node
	 * and serves only to differentiate code of different implementation teams.
     * For this implementation you could identify the `impl_name` with AssemblyScript f.e
     */
    private _implName: ScaleString;

    /**
     * `authoring_version` is the version of the authorship interface
     */
    private _authoringVersion: UInt32;

    /**
     * Version of the runtime specification.A full - node will not attempt to use its native
	 * runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
	 * `spec_version` and `authoring_version` are the same between Wasm and native.
     */
    private _specVersion: UInt32;


    /**
     * Version of the implementation of the specification. Nodes are free to ignore this; it
	 * serves only as an indication that the code is different; as long as the other two versions
	 * are the same then while the actual code may be different, it is nonetheless required to
	 * do the same thing.
	 * Non-consensus-breaking optimizations are about the only changes that could be made which
	 * would result in only the `impl_version` changing.
     */
    private _implVersion: UInt32;


    /**
     * List of supported API "features" along with their versions
     */
    private _apis: SupportedAPIs;

    /**
     * All existing dispatches are fully compatible when this number doesn't change. If this
     * number changes, then `spec_version` must change, also.
     */
    private _transactionVersion: UInt32;

    public get specName(): ScaleString {
        return this._specName;
    }

    public get implName(): ScaleString {
        return this._implName;
    }

    public get authoringVersion(): UInt32 {
        return this._authoringVersion;
    }

    public get specVersion(): UInt32 {
        return this._specVersion;
    }

    public get apis(): SupportedAPIs {
        return this._apis;
    }
    public get transactionVersion(): UInt32 {
        return this._transactionVersion;
    }

    public get implVersion(): UInt32 {
        return this._implVersion;
    }
    constructor(specName: string, implName: string, authoringVersion: u32, specVersion: u32, implVersion: u32, apis: SupportedAPIs, transactionVersion: u32) {
        this._specName = new ScaleString(specName);
        this._implName = new ScaleString(implName);
        this._authoringVersion = new UInt32(authoringVersion);
        this._specVersion = new UInt32(specVersion);
        this._implVersion = new UInt32(implVersion);
        this._apis = apis;
        this._transactionVersion = new UInt32(transactionVersion);
    }

    /**
     * @description SCALE Encodes the RuntimeVersion into u8[]
     */
    toU8a(): u8[] {
        return this._specName.toU8a()
            .concat(this._implName.toU8a())
            .concat(this._authoringVersion.toU8a())
            .concat(this._specVersion.toU8a())
            .concat(this._implVersion.toU8a())
            .concat(this._apis.toU8a())
            .concat(this._transactionVersion.toU8a())
    }

}
