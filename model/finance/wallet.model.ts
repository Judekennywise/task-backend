import mongoose, { Schema } from "mongoose";
import { IWallet } from "../../@types/model/wallet.type";

const walletSchema: Schema<IWallet> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "NGN",
    },
    bankDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: "BankDetails",
      },
    ],
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    lastTransactionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const walletModel = mongoose.model<IWallet>("Wallet", walletSchema);

export default walletModel;
