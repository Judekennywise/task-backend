import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let url: string = "";

if (process.env.DATABASE_NODE_ENV === "development") {
  url = process.env.MONGODB_DEVELOPMENT_URI || "";
} else {
  url = process.env.MONGODB_TEST_URI || "";
}

const dbUrl: string = url;

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDb;
