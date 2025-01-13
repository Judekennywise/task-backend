import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandlers";
import { MulterError } from "multer";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Handle Multer errors
  if (err instanceof MulterError) {
    let message;
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message =
          "File size is too large. Maximum size allowed is 2MB per image.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files. Maximum 5 files are allowed.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file. Please upload valid files.";
        break;
      default:
        message = err.message;
        break;
    }
    err = new ErrorHandler(message, 400);
  }

  // Wrong Mongodb Id Error
  if (err.name === "CastError") {
    const message = `Resources not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate Key Error
  if (err.name === "11000") {
    const message = `Duplicate ${Object.keys(err.keyValues)} entered.`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid. try again!`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expired Token
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired. try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Timeout Error
  if (err.message.includes("buffering timed out")) {
    const message = `Database operation timed out. Please try again later.`;
    err = new ErrorHandler(message, 500);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
