import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../../middleware/catchAsyncError";
import ejs from "ejs";
import path from "path";
import ErrorHandler from "../../../utils/errorHandlers";
import {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistrationBody,
  ISocialAuthBody,
} from "../../../@types/@controller-types/userController";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import SendMail from "../../../utils/sendMail";
import { IUser } from "../../../@types/model/userModel.type";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../../../utils/jwt";
import {
  getPersonByIdService,
  uploadAvatar,
} from "../../../services/user.service";
import userModel from "../../../model/account/user.model";

// check if user exist

// create a new user
export const RegisterUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstname, lastname, email, password } =
        req.body as IRegistrationBody;

      // Check if the new workMail or email already exists
      const isEmailExists = await userModel.findOne( { email: req.body.email });

      if (isEmailExists) {
        return next(new ErrorHandler("Email already exists!", 409));
      }

      const activationToken = CreateActivationToken(req.body);
      const activationCode = activationToken.activationCode;

      try {
        await SendMail({
          email,
          subject: "Activate your account!",
          template: `Thank you for registering with us, here is your activation code: ${activationCode}`,
        });

        res.status(201).json({
          success: true,
          message: `A message with your activation code has been sent to ${email}`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const ResendActivationCode = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, email } = req.body;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as Secret
      ) as { user: IUser; activationCode: string };

      if (newUser.user.email !== email) {
        return next(new ErrorHandler("You are not registered, please register", 400));
      }
      const activationToken = CreateActivationToken(newUser.user);
      const activationCode = activationToken.activationCode;

      try {
        await SendMail({
          email,
          subject: "Activate your account!",
          template: `You requested for a new activation code, here is your new activation code: ${activationCode}`,
        });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
        res.status(201).json({
          success: true,
          message: `A message with your activation code has been sent to ${email}`,
          activationToken: activationToken.token,
        });
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
})

// create a new activation token
export const CreateActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(10000 + Math.random() * 90000).toString();

  console.log(activationCode);

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "30m" }
  );

  return { token, activationCode };
};

// activate user
export const ActivateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as Secret
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("invalid activation code", 400));
      }

      const { email, firstname, lastname, password } =
        newUser.user;

      // Check if email already exist
      const emailExist = await userModel.findOne({ email });

      if (emailExist) {
        return next(new ErrorHandler("Email address already exist!", 400));
      }

      // Save data to user model
      const user = await userModel.create({
        email,
        firstname,
        lastname,
        password,
        isVerified: true,
      });



      try {
        await SendMail({
          email: email,
          subject: "Welcome to Inventory Management!",
          template: "Welcome to Inventory Management",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }

      res.status(201).json({
        message: "Account activated successfully",
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user
export const LoginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email })

      if (!user) {
        return next(new ErrorHandler("Account does not exist!", 400));
      }


      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return next(new ErrorHandler("Invalid credential", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const ForgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("Email does not exist!", 400));
      }

      const resetToken = jwt.sign(
        { id: user._id },
        process.env.RESET_PASSWORD_SECRET as Secret,
        { expiresIn: "30m" }
      );
      const resetPasswordUrl = `${process.env.DEVELOPMENT_CLIENT_URL}/reset-password/${resetToken}`;
      console.log(resetPasswordUrl)
      try {
        await SendMail({
          email,
          subject: "Reset your password!",
          template: `Click the link below to reset your password: ${resetPasswordUrl}`,
        });

        res.status(201).json({
          success: true,
          message: `A message with your reset password link has been sent to ${email}`,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
    catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  });

export const ResetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, resetToken } = req.body;

      if (!password) {
        return next(new ErrorHandler("Please enter a new password", 400));
      }

      if (!resetToken) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const decoded = jwt.verify(
        resetToken,
        process.env.RESET_PASSWORD_SECRET as Secret
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Invalid or expired token", 400));
      }

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.password = password;
      await user.save();

      res.status(201).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const LogoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      res.status(200).json({
        success: true,
        message: "Logged out successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const GetUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const personId = req.user?._id;
      getPersonByIdService(res, next, personId as string, userModel);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info --> Personal Info
export const UpdateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id; // Get user ID from the request

      if (!userId) {
        // Check if the user ID is available (user is authenticated)
        return next(new ErrorHandler("User not authenticated", 401));
      }

      const user = await userModel.findById(userId); // Find the user by ID

      if (!user) {
        // Check if the user exists
        return next(new ErrorHandler("User not found", 404));
      }

      // Ensure that workMail or email is provided and different from the current one
      
        // Check if the new workMail or email already exists
        const isEmailExists = await userModel.findOne({ email: req.body.workMail});

        if (isEmailExists) {
          return next(
            new ErrorHandler("Email or workMail already exists", 400)
          );
        }

      // If avatar is provided, upload it to Cloudinary
      if (req.body.avatar && req.body.avatar !== user.avatar.url) {
        const newAvatar = await uploadAvatar(req.body.avatar, user.avatar);
        req.body.avatar = newAvatar; // Set the new avatar in the request body to be updated
      }

      // Update the user with the new req.body from req.body and return the updated document
      const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });

      if (!updatedUser) {
        return next(new ErrorHandler("User update failed", 400));
      }

      res.status(200).json({
        success: true,
        user: updatedUser, // Return the updated user
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500)); // Handle any unexpected errors
    }
  }
);