// import Joi from "joi";
// import { Request, Response, NextFunction } from "express";
// import { MessageResponse } from "../utils/enum";
// import { utils } from "../utils";

// class UserValidator {
//     public async validateUserNameQuery(req: Request, res: Response, next: NextFunction) {
//     const schema = Joi.object({
//       userName: Joi.string().required().messages({
//         "any.required": "Username is required",
//       }),
//     });
//     const { error } = schema.validate(req.query);

//     if (!error) {
//       return next();
//     } else {
//       console.log(error);
//       return res.status(400).json({
//         message: MessageResponse.Error,
//         description: error.details[0].message,
//         data: null,
//       });
//     }
//   }
  
//   public async editProfile(req: Request, res: Response, next: NextFunction) {
//     const schema = Joi.object({
//       fullName: Joi.string().required().messages({
//         "string.base": "Fullname must be text",
//         "any.required": "Fullname is required.",
//       }),
//       bitcoinAddress: Joi.string()
//         .regex(/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/)
//         .required()
//         .messages({
//           "string.pattern.base": "Please enter a valid Bitcoin address",
//           "any.required": "Bitcoin address is required",
//         }),
//     });

//     const { error } = schema.validate(req.body);

//     if (!error) {
//       return next();
//     } else {
//       console.log(error);

//       return utils.customResponse({
//         status: 400,
//         res,
//         message: MessageResponse.Error,
//         description: error.details[0].message,
//         data: null,
//       });
//     }
//   }

//   public async changePasswordWithNewPassword(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     const schema = Joi.object({
//       newPassword: Joi.string()
//         .min(8)
//         .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
//         .required()
//         .messages({
//           "any.required": "New password is required.",
//           "string.min": "New password must be at least 8 characters long",
//           "string.pattern.base":
//             "New password must contain at least one uppercase letter, one lowercase letter, and one number",
//         }),
//       oldPassword: Joi.string().required().messages({
//         "string.base": "Old password must be text",
//         "any.required": "Old password is required.",
//       }),
//     });
//     const { error } = schema.validate(req.body);
//     if (!error) {
//       return next();
//     } else {
//       return utils.customResponse({
//         status: 400,
//         res,
//         message: MessageResponse.Error,
//         description: error.details[0].message,
//         data: null,
//       });
//     }
//   }
// }

// export const userValidator = new UserValidator();
