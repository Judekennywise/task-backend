import { Document, Schema } from "mongoose";

export interface IPhone {
  code: string;
  number: string;
  emoji: string;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  phone: IPhone;
  image: string | null;
  country: string;
  state: string;
  city: string;
  // countryId: string;
  // stateId: string;
  // cityId: string;
  location: {
    address: string;
    place: string;
    cordinates: {
      lat: number;
      long: number;
    };
  };
  avatar: {
    public_id: string;
    url: string;
  };
  isVerified: boolean;
  isApproved: boolean;
  blocked: boolean;
  username: string;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}
