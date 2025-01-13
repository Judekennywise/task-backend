import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  userId: { type: typeof Schema.Types.ObjectId; ref: string };
}