import { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  user: Schema.Types.ObjectId; // Reference to the user
  balance: number; // Current balance in the wallet
  currency: string; // Currency (e.g., "NGN")
  transactions: Schema.Types.ObjectId[]; // References to Payment transactions
  lastTransactionDate?: Date; // Date of the last transaction
  bankDetails: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
