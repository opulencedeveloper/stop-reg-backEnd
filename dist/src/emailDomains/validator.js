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
exports.emailDomainValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
class EmailDomainValidator {
    addEmailDomain(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                disposable_domain: joi_1.default.string()
                    .trim()
                    .pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
                    .required()
                    .messages({
                    "any.required": "Disposable domain is required.",
                    "string.empty": "Disposable domain cannot be empty.",
                    "string.pattern.base": "Invalid domain format. Example: sample.com or mail.sample.org",
                }),
                mx_record: joi_1.default.string().trim().required().messages({
                    "any.required": "MX record is required.",
                    "string.empty": "MX record cannot be empty.",
                }),
                public_email_provider: joi_1.default.boolean().required().messages({
                    "any.required": "Public email provider field is required.",
                    "boolean.base": "Public email provider must be true or false.",
                }),
                relay_domain: joi_1.default.boolean().required().messages({
                    "any.required": "Relay domain field is required.",
                    "boolean.base": "Relay domain must be true or false.",
                }),
            });
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (!error)
                return next();
            console.error(error);
            return utils_1.utils.customResponse({
                status: 400,
                res,
                message: enum_1.MessageResponse.Error,
                description: error.details[0].message,
                data: null,
            });
        });
    }
    checkDisposableEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                email: joi_1.default.string().email().required().messages({
                    "string.base": "Email must be text",
                    "strig.email": "Invalid email format",
                    "any.required": "Email is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                console.log(error);
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
    bulkDomainVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                domains: joi_1.default.array()
                    .items(joi_1.default.string()
                    .trim()
                    .pattern(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/ // ✅ allows with or without https
                )
                    .required()
                    .messages({
                    "string.base": "Each domain must be a string.",
                    "string.pattern.base": "Invalid domain format. Example: example.com or https://example.com",
                    "any.required": "Domain cannot be empty.",
                }))
                    .min(1)
                    .required()
                    .messages({
                    "array.base": "Domains must be an array.",
                    "array.min": "At least one domain is required.",
                    "any.required": "Domains array is required.",
                }),
            });
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (!error)
                return next();
            console.log(error);
            return utils_1.utils.customResponse({
                status: 400,
                res,
                message: enum_1.MessageResponse.Error,
                description: error.details[0].message,
                data: null,
            });
        });
    }
}
exports.emailDomainValidator = new EmailDomainValidator();
