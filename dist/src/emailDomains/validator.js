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
const loggin_1 = __importDefault(require("../utils/loggin"));
class EmailDomainValidator {
    addEmailDomain(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                bot_username: joi_1.default.string().trim().required().messages({
                    "any.required": "Bot username is required.",
                    "string.empty": "Bot username cannot be empty.",
                }),
                bot_password: joi_1.default.string().trim().required().messages({
                    "any.required": "Bot password is required.",
                    "string.empty": "Bot password cannot be empty.",
                }),
                domain: joi_1.default.string()
                    .trim()
                    .pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
                    .required()
                    .messages({
                    "any.required": "Domain is required.",
                    "string.empty": "Domain cannot be empty.",
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
            });
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (!error)
                return next();
            loggin_1.default.error(error);
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
                    "string.email": "Invalid email format",
                    "any.required": "Email is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                loggin_1.default.error(error);
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
            const body = req.body;
            // Helper function to convert index to ordinal (1st, 2nd, 3rd, etc.)
            const getOrdinal = (index) => {
                const position = index + 1; // Convert 0-based to 1-based
                const lastDigit = position % 10;
                const lastTwoDigits = position % 100;
                if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
                    return `${position}th`;
                }
                switch (lastDigit) {
                    case 1:
                        return `${position}st`;
                    case 2:
                        return `${position}nd`;
                    case 3:
                        return `${position}rd`;
                    default:
                        return `${position}th`;
                }
            };
            // Helper function to get ordinal word (first, second, third, etc.)
            const getOrdinalWord = (index) => {
                const position = index + 1; // Convert 0-based to 1-based
                const ordinals = {
                    1: "first",
                    2: "second",
                    3: "third",
                    4: "fourth",
                    5: "fifth",
                    6: "sixth",
                    7: "seventh",
                    8: "eighth",
                    9: "ninth",
                    10: "tenth",
                    11: "eleventh",
                    12: "twelfth",
                    13: "thirteenth",
                    14: "fourteenth",
                    15: "fifteenth",
                    16: "sixteenth",
                    17: "seventeenth",
                    18: "eighteenth",
                    19: "nineteenth",
                    20: "twentieth",
                };
                if (position <= 20) {
                    return ordinals[position];
                }
                // For numbers above 20, use the ordinal number format
                return getOrdinal(index);
            };
            // First validate that domains is an array
            if (!Array.isArray(body.domains)) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Domains must be an array.",
                    data: null,
                });
            }
            // Check if array is empty
            if (body.domains.length === 0) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "At least one domain is required.",
                    data: null,
                });
            }
            // Validate each domain individually to find the invalid one
            const domainSchema = joi_1.default.string()
                .trim()
                .pattern(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
                .required()
                .messages({
                "string.base": "Each domain must be a string.",
                "string.pattern.base": "Invalid domain format. Example: example.com or https://example.com",
                "any.required": "Domain cannot be empty.",
                "string.empty": "Domain cannot be empty.",
            });
            // Collect invalid domains and filter them out
            const invalidDomains = [];
            const validDomains = [];
            for (let i = 0; i < body.domains.length; i++) {
                const domain = body.domains[i];
                const { error } = domainSchema.validate(domain);
                if (error) {
                    const ordinalWord = getOrdinalWord(i);
                    invalidDomains.push({
                        domain,
                        index: i,
                        ordinal: ordinalWord,
                        error: error.details[0].message,
                    });
                }
                else {
                    validDomains.push(domain);
                }
            }
            // If all domains are invalid, return error
            if (validDomains.length === 0) {
                const invalidList = invalidDomains
                    .map((item) => `${item.domain} - The ${item.ordinal} item in the list`)
                    .join(", ");
                const errorMessage = invalidDomains.length === 1
                    ? invalidDomains[0].error
                    : "Multiple domains have invalid format";
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: `Error: ${errorMessage}. Invalid Domain(s): ${invalidList}.`,
                    data: null,
                });
            }
            // If some domains are invalid, log them but proceed with valid ones
            if (invalidDomains.length > 0) {
                const invalidList = invalidDomains
                    .map((item) => `${item.domain} - The ${item.ordinal} item in the list`)
                    .join(", ");
                loggin_1.default.warn(`Invalid domains filtered out: ${invalidList}. Proceeding with ${validDomains.length} valid domain(s).`);
            }
            // Replace the domains array with only valid domains
            req.body.domains = validDomains;
            // Proceed with valid domains
            return next();
        });
    }
}
exports.emailDomainValidator = new EmailDomainValidator();
