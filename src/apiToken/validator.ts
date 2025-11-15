import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";

class ApiTokenValidator {
  public async validateAPi(req: Request, res: Response, next: NextFunction) {
    // Extract token from path parameter (e.g., /api/check/3EKWDCK5rTcmRwDHXnNPvTszg5WMaEXD)
    // Try different possible parameter names
    const token =
      req.params.token ||
      req.params.apiToken ||
      req.params[0] ||
      (req.path.split("/").pop() as string);

    // Extract and decode email from query parameter
    const emailParam = req.query.email as string;
    let email = emailParam;

    if (emailParam) {
      try {
        // Decode URL encoding (%22voic@gmail.com%22 -> "voic@gmail.com")
        email = decodeURIComponent(emailParam);
        // Remove surrounding quotes if present ("voic@gmail.com" -> voic@gmail.com)
        email = email.replace(/^["']|["']$/g, "");
      } catch (error) {
        // If decoding fails, use original value
        email = emailParam.replace(/^["']|["']$/g, "");
      }
    }

    // Validate token
    const tokenSchema = Joi.string()
      .required()
      .min(1)
      .messages({
        "any.required": "API token is required.",
        "string.empty": "API token cannot be empty.",
      });

    // Validate email
    const emailSchema = Joi.string()
      .email()
      .required()
      .messages({
        "any.required": "Email is required.",
        "string.empty": "Email cannot be empty.",
        "string.email": "Email must be a valid email address.",
      });

    const tokenValidation = tokenSchema.validate(token);
    const emailValidation = emailSchema.validate(email);

    if (tokenValidation.error) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: tokenValidation.error.details[0].message,
        data: null,
      });
    }

    if (emailValidation.error) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: emailValidation.error.details[0].message,
        data: null,
      });
    }

    // Attach extracted values to request for use in controller
    (req as any).extractedToken = token;
    (req as any).extractedEmail = email;

    next();
  }
}

export const apiTokenValidator = new ApiTokenValidator();
