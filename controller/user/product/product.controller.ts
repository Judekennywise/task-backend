import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../../middleware/catchAsyncError";
import ErrorHandler from "../../../utils/errorHandlers";
import {
  uploadAvatar,
} from "../../../services/user.service";
import userModel from "../../../model/account/user.model";
import { Product } from "../../../model/product/product.model";
import paymentModel from "../../../model/finance/payment.model";


export const createProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, quantity, price } = req.body;
  
      const product = new Product({ name, description, quantity, price, userId: req.user?._id });
      const savedProduct = await product.save();
  
      res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (err:any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getAllProducts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Convert `page` and `limit` to numbers with default fallback
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      // Calculate the skip value for pagination
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch products with pagination
      const products = await Product.find()
        .populate('userId')
        .skip(skip)
        .limit(limitNumber);

      // Get total count of products for pagination metadata
      const totalProducts = await Product.countDocuments();

      // Pagination metadata
      const totalPages = Math.ceil(totalProducts / limitNumber);

      res.status(200).json({
        data: products,
        meta: {
          totalProducts,
          totalPages,
          currentPage: pageNumber,
          pageSize: limitNumber,
        },
      });
    } catch (err:any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);


// update user stage
export const updateProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return  next(new ErrorHandler( 'Product not found', 404 ));
  
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err:any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// delete product
export const deleteProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return next(new ErrorHandler('Product not found', 404 ));

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err:any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const checkOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { reference } = req.body;

  if (!reference) {
    res.status(400).json({ error: 'Order reference is required' });
    return;
  }

  try {
    // Find the order by its reference
    const order = await paymentModel.findOne({ transactionReference: reference });

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
      
    }

    // Check the order status
    const status = order.status; // Assuming `status` is a field in your Order model

    res.status(200).json({
      status: 'success',
      message: 'Order status retrieved successfully',
      data: {
        reference: order.transactionReference,
        status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (err:any) {
    return next(new ErrorHandler(err.message, 500));
  }
};