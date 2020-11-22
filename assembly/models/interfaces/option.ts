import { Codec } from "as-scale-codec";

/**
 * @description Interface for Option Model
 */
export interface IOption<T> extends Codec{
    /**
     * @description Checks whether the `Option` contains a value.
     * @returns True if the `Option` has some value.
     */
    isSome(): bool;

    /**
	 * @description Unwraps the `Option`, returning the inner value (or `null` if there was none).
	 * @returns The inner value, or `null` if there was none.
	 */
    unwrap(): Codec | null;
}