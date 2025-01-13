import { Request } from "express";
import { IUser } from "../model/userModel.type";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      resizedImages?: Express.Multer.File[]; // Define the resized Images property in the Request interface
    }
  }
}
