/**
 * Reasons for moving funds out of an account.
 */ 
export enum WithdrawReasons {
    /// In order to pay for (system) transaction costs.
    TRANSACTION_PAYMENT = 0b00000001,
    /// In order to transfer ownership.
    TRANSFER = 0b00000010,
    /// In order to reserve some funds for a later return or repatriation.
    RESERVE = 0b00000100,
    /// In order to pay some other (higher-level) fees.
    FEE = 0b00001000,
    /// In order to tip a validator for transaction inclusion.
    TIP = 0b00010000

}
/**
 * Simple boolean for whether an account needs to be kept in existence.
 */
export enum ExistenceRequirement {
	/// Operation must not result in the account going out of existence.
	///
	/// Note this implies that if the account never existed in the first place, then the operation
	/// may legitimately leave the account unchanged and still non-existent.
	KeepAlive = 1,
	/// Operation may result in account going out of existence.
	AllowDeath = 0,
}
