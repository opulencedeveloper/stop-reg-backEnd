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
exports.subscriptionPlanValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const enum_2 = require("./enum");
class SubscriptionPlanValidator {
    createSubscriptionPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                name: joi_1.default.string()
                    .valid(...Object.values(enum_2.SubPlan))
                    .required()
                    .messages({
                    "any.only": "Invalid subscription plan name. Must be one of Free, Standard, Plus, Pro, or Max.",
                    "any.required": "Subscription plan name is required.",
                }),
                monthlyPrice: joi_1.default.number().min(0).required().messages({
                    "number.base": "Monthly price must be a number.",
                    "number.min": "Monthly price cannot be negative.",
                    "any.required": "Monthly price is required.",
                }),
                apiLimit: joi_1.default.number().allow(null).messages({
                    "number.base": "API limit must be a number or null (for unlimited).",
                }),
                durationInDays: joi_1.default.number().positive().required().messages({
                    "number.base": "Duration must be a number.",
                    "number.positive": "Duration must be greater than 0.",
                    "any.required": "Duration is required.",
                }),
                isRecommended: joi_1.default.boolean().required().messages({
                    "boolean.base": "isRecommended must be a boolean value.",
                    "any.required": "isRecommended field is required.",
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
exports.subscriptionPlanValidator = new SubscriptionPlanValidator();
