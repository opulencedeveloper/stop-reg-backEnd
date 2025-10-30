import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { IAddEmailDomainUserInput, IBulkVerification, ICheckDisposableEmail } from "./interface";

class EmailDomainValidator {
  public async addEmailDomain(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<IAddEmailDomainUserInput>({
      disposable_domain: Joi.string()
        .trim()
        .pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
        .required()
        .messages({
          "any.required": "Disposable domain is required.",
          "string.empty": "Disposable domain cannot be empty.",
          "string.pattern.base":
            "Invalid domain format. Example: sample.com or mail.sample.org",
        }),

      mx_record: Joi.string().trim().required().messages({
        "any.required": "MX record is required.",
        "string.empty": "MX record cannot be empty.",
      }),

      public_email_provider: Joi.boolean().required().messages({
        "any.required": "Public email provider field is required.",
        "boolean.base": "Public email provider must be true or false.",
      }),

      relay_domain: Joi.boolean().required().messages({
        "any.required": "Relay domain field is required.",
        "boolean.base": "Relay domain must be true or false.",
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

  public async checkDisposableEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object<ICheckDisposableEmail>({
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

public async bulkDomainVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = Joi.object<IBulkVerification>({
    domains: Joi.array()
      .items(
        Joi.string()
          .trim()
          .pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/ // ✅ allows with or without https
          )
          .required()
          .messages({
            "string.base": "Each domain must be a string.",
            "string.pattern.base":
              "Invalid domain format. Example: example.com or https://example.com",
            "any.required": "Domain cannot be empty.",
          })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Domains must be an array.",
        "array.min": "At least one domain is required.",
        "any.required": "Domains array is required.",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (!error) return next();

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

export const emailDomainValidator = new EmailDomainValidator();
