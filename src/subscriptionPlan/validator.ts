import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { SubPlan } from "./enum";
import { ICreateSubscriptionPlanUserInput } from "./interface";

class SubscriptionPlanValidator {
  public async createSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object<ICreateSubscriptionPlanUserInput>({
      name: Joi.string()
        .valid(...Object.values(SubPlan))
        .required()
        .messages({
          "any.only":
            "Invalid subscription plan name. Must be one of Free, Standard, Plus, Pro, or Max.",
          "any.required": "Subscription plan name is required.",
        }),

      monthlyPrice: Joi.number().min(0).required().messages({
        "number.base": "Monthly price must be a number.",
        "number.min": "Monthly price cannot be negative.",
        "any.required": "Monthly price is required.",
      }),

      apiLimit: Joi.number().allow(null).messages({
        "number.base": "API limit must be a number or null (for unlimited).",
      }),

      durationInDays: Joi.number().positive().required().messages({
        "number.base": "Duration must be a number.",
        "number.positive": "Duration must be greater than 0.",
        "any.required": "Duration is required.",
      }),

      isRecommended: Joi.boolean().required().messages({
        "boolean.base": "isRecommended must be a boolean value.",
        "any.required": "isRecommended field is required.",
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

export const subscriptionPlanValidator = new SubscriptionPlanValidator();
