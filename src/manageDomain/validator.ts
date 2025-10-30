import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAddDomainUserInput } from "./interface";
import { ManageDomainStatus, ManageDomainType } from "./enum";

class ManageDomainValidator {
  public async addDomain(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<IAddDomainUserInput>({
      domain: Joi.string()
        .trim()
        .pattern(
          /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/ 
        )
        .required()
        .messages({
          "any.required": "Domain is required.",
          "string.empty": "Domain cannot be empty.",
          "string.pattern.base":
            "Domain format is invalid. Example: www.macdonald.com",
        }),

      status: Joi.string()
        .valid(...Object.values(ManageDomainStatus))
        .required()
        .messages({
          "any.required": "Status is required.",
          "any.only": `Status must be one of: ${Object.values(
            ManageDomainStatus
          ).join(", ")}.`,
        }),

      type: Joi.string()
        .valid(...Object.values(ManageDomainType))
        .required()
        .messages({
          "any.required": "Type is required.",
          "any.only": `Type must be one of: ${Object.values(
            ManageDomainType
          ).join(", ")}.`,
        }),

      comment: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": "Comment is required.",
          "string.empty": "Comment cannot be empty.",
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: true });

    if (!error) return next();

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

export const manageDomainValidator = new ManageDomainValidator();
