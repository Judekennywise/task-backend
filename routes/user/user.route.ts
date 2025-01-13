import express from "express";
import { isAuthenticated } from "../../middleware/auth";
import {
  ActivateUser,
  GetUserInfo,
  LoginUser,
  LogoutUser,
  RegisterUser,
  ResendActivationCode,
  ForgotPassword,
  ResetPassword
} from "../../controller/user/auth/auth.controller";

const userRouter = express.Router();

userRouter.post("/registration", RegisterUser);
userRouter.post("/activate-user", ActivateUser);
userRouter.post("/login", LoginUser);
userRouter.post("/forgot-password", ForgotPassword);
userRouter.post("/reset-password", ResetPassword);
userRouter.post("/resend-activation-code", ResendActivationCode);
userRouter.get("/logout", isAuthenticated, LogoutUser);
userRouter.get("/get-user", isAuthenticated, GetUserInfo);


export default userRouter;
