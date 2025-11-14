import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import {
  IEmailVerifyInput,
  ILoginUserInput,
  IRegisterUserInput,
} from "./interface";

class AuthValidator {
  public async registerUser(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<IRegisterUserInput>({
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email address is required",
      }),
      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "Password is required.",
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),
    });

    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      console.log(error);

      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }

  public async logIn(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<ILoginUserInput>({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required.",
      }),
    });
    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      console.log(error);
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<IEmailVerifyInput>({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
      otp: Joi.string().required().messages({
        "any.required": "OTP is required.",
      }),
    });
    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }

    public async validateEmail(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<IEmailVerifyInput>({
      email: Joi.string().email().required().messages({
        "string.base": "Email must be text",
        "strig.email": "Invalid email format",
        "any.required": "Email is required.",
      }),
    });
    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }
}

export const authValidator = new AuthValidator();
