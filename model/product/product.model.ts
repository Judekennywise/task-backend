import { Schema, model, Document } from 'mongoose';
import { IProduct } from '../../@types/model/product.type';

const productSchema = new Schema<IProduct>(
    {
      name: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
  );
  
  export const Product = model<IProduct>('Product', productSchema);