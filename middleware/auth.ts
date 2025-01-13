import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/errorHandlers";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/account/user.model";
import { IUser }from "../@types/model/userModel.type"
dotenv.config();

// Authenticated user
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid!", 401));
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler("Please, login to access this resource.", 404)
      );
    }

    req.user = user as IUser;

    next();
  }
);