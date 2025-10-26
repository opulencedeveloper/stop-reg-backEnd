import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { comparePassword } from "../utils/auth";
import { MessageResponse } from "../utils/enum";

import { userService } from "../user/service";
import { IRegisterUserInput } from "./interface";
import { utils } from "../utils";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "";

class AuthController {
  public async registerUser(req: Request, res: Response) {
    const body: IRegisterUserInput = req.body;

    const email = body.email;

    const emailExists = await userService.findUserByEmail(email);

    if (emailExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "Email already exist!",
        data: null,
      });
    } 

    await userService.createUser(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "User created successfully!",
      data: null,
    });
  }
  public async logIn(req: Request, res: Response) {
    const { password, email } = req.body;

    const userExists = await userService.findUserByEmail(email);

    if (!userExists) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const match = await comparePassword(password, userExists.password);

    if (!match) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Wrong user credentials!",
        data: null,
      });
    }

    const token = jwt.sign({ userId: userExists._id }, jwtSecret, {
      expiresIn: "30d",
    });

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: {
        token,
      },
    });
  }
}

export const authController = new AuthController();
