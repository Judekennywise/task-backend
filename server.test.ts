import request from "supertest";
import {app} from "./app";
import userModel from "./model/account/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

jest.mock("./utils/sendMail");
jest.mock("./model/account/user.model");

describe("User Controller Tests", () => {
  let mockUser: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      _id: "userId123",
      email: "test@example.com",
      firstname: "Test",
      lastname: "User",
      password: "hashedpassword",
      isVerified: true,
    };
  });

  describe("RegisterUser", () => {
    it("should register a user and send an activation email", async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);
      (userModel.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/v1/registration")
        .send({
          firstname: "Test",
          lastname: "User",
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("activation code");
    });

    it("should return an error if the email already exists", async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/v1/registration")
        .send({
          firstname: "Test",
          lastname: "User",
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Email already exists!");
    });
  });

  

  describe("LoginUser", () => {
    it("should log in a user with valid credentials", async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (userModel.findOne as jest.Mock).mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(true),
        SignAccessToken: jest.fn().mockReturnValue("mockAccessToken"),
        SignRefreshToken: jest.fn().mockReturnValue("mockRefreshToken"),
      });
      const response = await request(app)
        .post("/api/v1/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return an error for invalid credentials", async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      const response = await request(app)
        .post("/api/v1/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credential");
    });
  });
})