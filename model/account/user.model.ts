import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../../@types/model/userModel.type";
dotenv.config();

const { ObjectId } = mongoose.Schema;

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

enum UserRole {
  CUSTOMER = "customer",
  CREATOR = "creator",
}

// Reusable email validation
const emailValidation = {
  validator: (value: string) => emailRegexPattern.test(value),
  message: "Please enter a valid email address",
};

const CoordinatesSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: false,
      min: -90,
      max: 90,
    },
    long: {
      type: Number,
      required: false,
      min: -180,
      max: 180,
    },
  },
  { _id: false }
);

const userSchema: Schema<IUser> = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter your firstname."],
    },
    lastname: {
      type: String,
      required: [true, "Please enter your lastname."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      validate: emailValidation,
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    dob: { type: String, required: false, default: "" },
    gender: { type: String, required: false, default: "" },
    phone: {
      code: { type: String, default: "+234" },
      number: { type: String, default: "" },
      emoji: { type: String, default: "🇳🇬" },
    },
    country: { type: String, default: "Nigeria" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    location: {
      address: {
        type: String,
        required: false,
        default: "",
      },
      place: {
        type: String,
        required: false,
        default: "",
      },
      coordinates: {
        type: CoordinatesSchema,
        required: false,
        default: null,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    username: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "20m",
  });
};
// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "7d",
  });
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
