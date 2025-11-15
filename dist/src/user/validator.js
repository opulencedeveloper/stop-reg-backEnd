"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
class UserValidator {
    updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                currentPassword: joi_1.default.string().required().messages({
                    "any.required": "Current password is required.",
                    "string.empty": "Current password cannot be empty.",
                }),
                password: joi_1.default.string()
                    .min(8)
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
                    .required()
                    .messages({
                    "any.required": "New password is required.",
                    "string.min": "New password must be at least 8 characters long.",
                    "string.pattern.base": "New password must contain at least one uppercase letter, one lowercase letter, and one number.",
                }),
                confirmPassword: joi_1.default.string()
                    .valid(joi_1.default.ref("password"))
                    .required()
                    .messages({
                    "any.required": "Confirm password is required.",
                    "any.only": "Passwords do not match.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                console.error(error);
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
        });
    }
    updateFullName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                fullName: joi_1.default.string().required().messages({
                    "any.required": "Fullname is required.",
                    "string.empty": "Fullname cannot be empty.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                console.error(error);
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: error.details[0].message,
                    data: null,
                });
            }
        });
    }
}
exports.userValidator = new UserValidator();
