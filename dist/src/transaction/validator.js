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
exports.transactionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
class TransactionValidator {
    deposit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionSchema = joi_1.default.object({
                amount: joi_1.default.number().min(1).required().messages({
                    "any.required": "Amount is required.",
                    "number.base": "Amount must be a number.",
                    "number.min": "Amount must be greater than 1.",
                }),
            });
            const { error, value } = transactionSchema.validate(req.body, {
                abortEarly: true,
                convert: true, // ensures "1000.50" → 1000.5
            });
            if (!error) {
                req.body = value; // ✅ replace body with validated + coerced data
                return next();
            }
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
exports.transactionValidator = new TransactionValidator();
