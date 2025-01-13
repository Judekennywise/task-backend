import { NextFunction, Request, Response } from "express";
import paymentModel from "../../model/finance/payment.model";
import { catchAsyncError } from "../../middleware/catchAsyncError";
import axios from "axios";
import crypto from 'crypto';
import { IPAYSTACKResponse } from "../../@types/paystack/response.types";
import { Product } from "../../model/product/product.model";
import ErrorHandler from "../../utils/errorHandlers";


export const InitializePayment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
  const { productId, amount, email }: { productId: string; amount: number; email: string } = req.body;

  try {
    if (!productId || !amount || !email) {
      return res.status(400).json({ error: 'productId, amount, and email are required.' });
    }

    const productData = await Product.findById(productId)
    if(!productData){
      return next(new ErrorHandler("Product does not exist",404))
    }
    if(productData.price !== amount){
      return next(new ErrorHandler("Amount does not match", 400))
    }

    const order = new paymentModel({ productId, amount, paidAt: new Date() });
    await order.save();

    const response: IPAYSTACKResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    order.transactionReference = response.data?.data.reference;
    await order.save();

    res.status(201).json({ message: 'Payment initialized', data: response.data });
  } catch (err:any) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export const webHook = catchAsyncError(
  async (req: Request, res: Response) => {
    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    console.log("runningwebhook")
    if (hash === req.headers['x-paystack-signature']) {
    
    const { event, data } = req.body;
  
    if (event === 'charge.success') {
      try {
        const order = await paymentModel.findOne({ transactionReference: data.reference });
        if (!order) return console.log({ error: 'Order not found' });
  
        order.status = 'paid';
        await order.save();
  
        res.status(200).json({ message: 'Order status updated to paid' });
      } catch (err:any) {
        console.log(err.message)
      }
    } else {
      console.log(hash, req.headers['x-paystack-signature'])
    }
    } else {
      console.log("Event not handled")
    }
  });