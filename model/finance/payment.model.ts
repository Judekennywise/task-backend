import mongoose, { Schema } from "mongoose";
import { IPayment } from "../../@types/model/payment.type";

const paymentSchema: Schema<IPayment> = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "NGN",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Paystack",
    },
    transactionReference: {
      type: String,
      required: false,
      unique: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    description: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model<IPayment>("Payment", paymentSchema);

export default paymentModel;
