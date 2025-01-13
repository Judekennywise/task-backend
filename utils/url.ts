import dotenv from "dotenv";
dotenv.config();

// Determine the base URL based on the environment
export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_URL
    : process.env.DEVELOPMENT_CLIENT_URL;
