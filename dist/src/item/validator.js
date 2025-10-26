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
exports.itemValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
class ItemValidator {
    validateUserInputItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemSchema = joi_1.default.object({
                name: joi_1.default.string().required().messages({
                    "any.required": "Item name is required.",
                    "string.base": "Item name must be a string.",
                }),
                price: joi_1.default.number().min(1).required().messages({
                    "any.required": "Item price is required.",
                    "number.base": "Item price must be a number.",
                    "number.min": "Item price must be greater than 1.",
                }),
                quantity: joi_1.default.number().integer().min(1).required().messages({
                    "any.required": "Item quantity is required.",
                    "number.base": "Item quantity must be a number.",
                    "number.integer": "Item quantity must be an integer.",
                    "number.min": "Item quantity must be at least 1.",
                }),
                description: joi_1.default.string().required().messages({
                    "any.required": "Item description is required.",
                    "string.base": "Item description must be a string.",
                }),
                imageUrl: joi_1.default.string().uri().required().messages({
                    "any.required": "Item image URL is required.",
                    "string.uri": "Item image URL must be a valid URI.",
                }),
                date: joi_1.default.date().optional(),
            });
            const schema = joi_1.default.object({
                title: joi_1.default.string().required().messages({
                    "any.required": "Title is required.",
                    "string.base": "Title must be a string.",
                }),
                buyerUserName: joi_1.default.string().required().messages({
                    "any.required": "Buyer user name is required.",
                    "string.base": "Buyer user name must be a string.",
                }),
                arrivalDate: joi_1.default.date()
                    .required()
                    .custom((value, helpers) => {
                    const today = new Date();
                    const inputDate = new Date(value);
                    today.setHours(0, 0, 0, 0);
                    inputDate.setHours(0, 0, 0, 0);
                    if (inputDate < today) {
                        return helpers.error("date.minToday");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Arrival date is required.",
                    "date.base": "Arrival date must be a valid date.",
                    "date.minToday": "Arrival date must be today or in the future.",
                }),
                items: joi_1.default.array().items(itemSchema).min(1).required().messages({
                    "any.required": "Items are required.",
                    "array.min": "At least one item must be included.",
                }),
            });
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (!error) {
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
    editSellerItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemSchema = joi_1.default.object({
                _id: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Item _id is required.",
                    "any.invalid": "Item _id must be a valid ObjectId.",
                }),
                name: joi_1.default.string().required().messages({
                    "any.required": "Item name is required.",
                    "string.base": "Item name must be a string.",
                }),
                price: joi_1.default.number().min(1).required().messages({
                    "any.required": "Item price is required.",
                    "number.base": "Item price must be a number.",
                    "number.min": "Item price must be greater than 1.",
                }),
                quantity: joi_1.default.number().integer().min(1).required().messages({
                    "any.required": "Item quantity is required.",
                    "number.base": "Item quantity must be a number.",
                    "number.integer": "Item quantity must be an integer.",
                    "number.min": "Item quantity must be at least 1.",
                }),
                description: joi_1.default.string().required().messages({
                    "any.required": "Item description is required.",
                    "string.base": "Item description must be a string.",
                }),
                imageUrl: joi_1.default.string().uri().required().messages({
                    "any.required": "Item image URL is required.",
                    "string.uri": "Item image URL must be a valid URI.",
                }),
            });
            const schema = joi_1.default.object({
                itemId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "itemId is required.",
                    "any.invalid": "itemId must be a valid ObjectId.",
                }),
                item: itemSchema.required().messages({
                    "any.required": "Item data is required.",
                }),
            });
            const { error } = schema.validate(req.body, { abortEarly: true });
            if (!error)
                return next();
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
exports.itemValidator = new ItemValidator();
