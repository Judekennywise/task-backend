import { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  user: Schema.Types.ObjectId; // Reference to the user making the payment
  productId: Schema.Types.ObjectId; // Reference to the product being paid for
  amount: number; // Amount to be paid
  currency: string; // Currency used (e.g., "NGN")
  status: string; // Payment status (e.g., "pending", "success", "failed")
  paymentMethod?: string; // Payment method (e.g., "Paystack")
  transactionReference: string; // Unique reference from Paystack
  description?: string; // Description or purpose of the payment
  paidAt?: Date; // Date when the payment was completed
  createdAt: Date;
  updatedAt: Date;
}
