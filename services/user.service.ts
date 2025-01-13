import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import userModel from "../model/account/user.model";
import ErrorHandler from "../utils/errorHandlers";
import { Model } from "mongoose";

// Get person by Id
export const getPersonByIdService = async (
  res: Response,
  next: NextFunction,
  id: string,
  model: Model<any>
) => {

  // If not cached, fetch user from the database
  const data = await model.findById(id);

  // Handle case where user is not found
  if (!data) {
    return next(new ErrorHandler("User not found", 404));
  }


  res.status(200).json({
    success: true,
    user: data,
  });
};

// Get all
export const getAllPersonService = async (
  res: Response,
  next: NextFunction,
  model: Model<any, {}, {}, {}, any, any>
) => {
  const data = await model.find().sort({ createdAt: -1 });


  res.status(200).json({
    success: true,
    data: data,
  });
};

// Update data
export const updateService = async (
  res: Response,
  req: Request,
  next: NextFunction,
  id: string,
  model: Model<any>,
  name: string
) => {
  const data = await model.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: `${name} updated successfully`,
    data: data,
  });
};

// Delete data
export const deleteService = async (
  res: Response,
  next: NextFunction,
  id: string,
  model: Model<any>
) => {
  const data = await model.findByIdAndDelete(id);

  if (!data) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(201).json({
    success: true,
    message: "Deleted Successfully",
  });
};


// upload profile avatar
export const uploadAvatar = async (
  avatar: string,
  existingAvatar?: { public_id: string }
) => {
  if (avatar && existingAvatar) {
    // If the user has an avatar i.e He/She registered with Social auth, then call this if
    if (existingAvatar?.public_id) {
      // first del the old message
      await cloudinary.v2.uploader.destroy(existingAvatar?.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folders: "avatars",
        width: 350,
      });

      return {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folders: "avatars",
        width: 350,
      });

      return {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
  }
};