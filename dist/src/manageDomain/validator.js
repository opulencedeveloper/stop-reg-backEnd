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
exports.manageDomainValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const enum_2 = require("./enum");
class ManageDomainValidator {
    addDomain(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                domain: joi_1.default.string()
                    .trim()
                    .pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
                    .required()
                    .messages({
                    "any.required": "Domain is required.",
                    "string.empty": "Domain cannot be empty.",
                    "string.pattern.base": "Domain format is invalid. Example: www.macdonald.com",
                }),
                status: joi_1.default.string()
                    .valid(...Object.values(enum_2.ManageDomainStatus))
                    .required()
                    .messages({
                    "any.required": "Status is required.",
                    "any.only": `Status must be one of: ${Object.values(enum_2.ManageDomainStatus).join(", ")}.`,
                }),
                type: joi_1.default.string()
                    .valid(...Object.values(enum_2.ManageDomainType))
                    .required()
                    .messages({
                    "any.required": "Type is required.",
                    "any.only": `Type must be one of: ${Object.values(enum_2.ManageDomainType).join(", ")}.`,
                }),
                comment: joi_1.default.string()
                    .trim()
                    .required()
                    .messages({
                    "any.required": "Comment is required.",
                    "string.empty": "Comment cannot be empty.",
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
}
exports.manageDomainValidator = new ManageDomainValidator();
