import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IUpdatePasswordUserInput } from "./interface";

class UserValidator {
  public async updateUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object<IUpdatePasswordUserInput>({
      currentPassword: Joi.string().required().messages({
        "any.required": "Current password is required.",
        "string.empty": "Current password cannot be empty.",
      }),

      password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
          "any.required": "New password is required.",
          "string.min": "New password must be at least 8 characters long.",
          "string.pattern.base":
            "New password must contain at least one uppercase letter, one lowercase letter, and one number.",
        }),

      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm password is required.",
          "any.only": "Passwords do not match.",
        }),
    });

    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      console.error(error);

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

export const userValidator = new UserValidator();
