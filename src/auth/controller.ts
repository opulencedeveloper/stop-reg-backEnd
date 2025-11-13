import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { comparePassword } from "../utils/auth";
import { MessageResponse } from "../utils/enum";

import { IRegisterUserInput } from "./interface";
import { utils } from "../utils";
import { subscriptionPlanService } from "../subscriptionPlan/service";
import { SubPlan } from "../subscriptionPlan/enum";
import { userService } from "../user/service";
import { sendEmailVerificationMail } from "../utils/email";
import { IVerifyEmail } from "../utils/interface";
import { authService } from "./service";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;

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

    const plan = await subscriptionPlanService.findPlanByName(SubPlan.Free);

    console.log(plan);

    if (!plan) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Could not complete!",
        data: null,
      });
    }
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + plan.durationInDays);

    const apiToken = utils.generateApiToken();

    const apiRequestLeft = plan.apiLimit;

    const otp = utils.generateOtp();

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await userService.createUser({
      ...body,
      planId: plan._id,
      tokenExpiresAt,
      apiRequestLeft,
      apiToken,
      emailVerificationOtp: otp,
      emailVerificationOtpExpiration: expiryTime,
    });

    sendEmailVerificationMail({
      email: body.email,
      otp: otp,
      expiryTime: "5 minutes",
    });

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

       const isEmailVerified = await authService.checkEmailVerificationStatus(
      email
    );

    if (!isEmailVerified) {
      const otp = utils.generateOtp();

      const email = userExists.email;


      await authService.saveOtp({ email, otp });

      await sendEmailVerificationMail({
        email,
        otp,
        expiryTime: "5 minutes",
      });

      return utils.customResponse({
        status: 200,
        res,
        message: MessageResponse.VerifyEmail,
        description: `A  verication otp  has been sent to ${email}!`,
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

  public async emailVerifyOtp(req: Request, res: Response) {
    const body: IVerifyEmail = req.body;

    const email = body.email;
    const otp = body.otp;

    const userOtpValidity = await authService.validateOtp(email, otp);

    if (!userOtpValidity) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Success,
        description: "Invalid otp",
        data: null,
      });
    }

    if (userOtpValidity.emailVerified) {
        return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Success,
        description: "Email already verified!",
        data: null,
      });
    }

    if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
      const currentDate = new Date();

      const expirationDate = new Date(
        userOtpValidity.emailVerificationOtpExpiration
      );

      if (expirationDate < currentDate) {
        return utils.customResponse({
          status: 400,
          res,
          message: MessageResponse.Error,
          description: "Email verification OTP has expired!",
          data: null,
        });
      }

      const userExists = await authService.verifyEmail(email);

      if (!userExists) {
        return utils.customResponse({
          status: 404,
          res,
          message: MessageResponse.Error,
          description: "User not found!",
          data: null,
        });
      }

      return utils.customResponse({
        status: 200,
        res,
        message: MessageResponse.Success,
        description: "Verification successful",
        data: null,
      });
    } else {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Email verification OTP expired",
        data: null,
      });
    }
  }
}

export const authController = new AuthController();
