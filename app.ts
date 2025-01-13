import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import path from "path";
import userRouter from "./routes/user/user.route";
import productRouter from "./routes/product/product.route";
import paymentRouter from "./routes/payment/payment.route";

// Initialize Express App
export const app = express();

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// Cors
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/api/v1",
  userRouter,
  productRouter,
  paymentRouter,
);



// Error Middleware
app.use(ErrorMiddleware);

