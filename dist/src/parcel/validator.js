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
exports.parcelValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
class ParcelValidator {
    createParcel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcelItemSchema = joi_1.default.object({
                name: joi_1.default.string().required().messages({
                    "any.required": "Parcel item name is required.",
                    "string.base": "Parcel item name must be a string.",
                }),
                price: joi_1.default.number().min(1).required().messages({
                    "any.required": "Parcel item price is required.",
                    "number.base": "Parcel item price must be a number.",
                    "number.min": "Parcel item price must be greater than 1.",
                }),
                quantity: joi_1.default.number().integer().min(1).required().messages({
                    "any.required": "Parcel item quantity is required.",
                    "number.base": "Parcel item quantity must be a number.",
                    "number.integer": "Parcel item quantity must be an integer.",
                    "number.min": "Parcel item quantity must be at least 1.",
                }),
                description: joi_1.default.string().required().messages({
                    "any.required": "Parcel item description is required.",
                    "string.base": "Parcel item description must be a string.",
                }),
                imageUrl: joi_1.default.string().uri().required().messages({
                    "any.required": "Parcel item image URL is required.",
                    "string.uri": "Parcel item image URL must be a valid URI.",
                }),
                date: joi_1.default.date().optional(),
            });
            const createParcelSchema = joi_1.default.object({
                title: joi_1.default.string().required().messages({
                    "any.required": "Parcel title is required.",
                    "string.base": "Parcel title must be a string.",
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
                parcelItems: joi_1.default.array()
                    .items(parcelItemSchema)
                    .min(1)
                    .required()
                    .messages({
                    "any.required": "Parcel items are required.",
                    "array.min": "At least one item must be included.",
                }),
            });
            const { error } = createParcelSchema.validate(req.body, {
                abortEarly: true,
            });
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
    editParcel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const editParcelschema = joi_1.default.object({
                parcelId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel id is required.",
                    "any.invalid": "Parcel id must be a valid ObjectId.",
                }),
                title: joi_1.default.string().required().messages({
                    "any.required": "Parcel title is required.",
                    "string.base": "Parcel title must be a string.",
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
            });
            const { error } = editParcelschema.validate(req.body, { abortEarly: true });
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
    editParcelItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const editParcelSchema = joi_1.default.object({
                parcelId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel id is required.",
                    "any.invalid": "Parcel id must be a valid ObjectId.",
                }),
                parcelItemId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel item id is required.",
                    "any.invalid": "Parcel item id must be a valid ObjectId.",
                }),
                name: joi_1.default.string().required().messages({
                    "any.required": "Parcel item name is required.",
                    "string.base": "Parcel item name must be a string.",
                }),
                price: joi_1.default.number().min(1).required().messages({
                    "any.required": "Parcel item price is required.",
                    "number.base": "Parcel item price must be a number.",
                    "number.min": "Parcel item price must be greater than 1.",
                }),
                quantity: joi_1.default.number().integer().min(1).required().messages({
                    "any.required": "Parcel item quantity is required.",
                    "number.base": "Parcel item quantity must be a number.",
                    "number.integer": "Parcel item quantity must be an integer.",
                    "number.min": "Parcel item quantity must be at least 1.",
                }),
                description: joi_1.default.string().required().messages({
                    "any.required": "Parcel item description is required.",
                    "string.base": "Parcel item description must be a string.",
                }),
                imageUrl: joi_1.default.string().uri().required().messages({
                    "any.required": "Parcel item image URL is required.",
                    "string.uri": "Parcel item image URL must be a valid URI.",
                }),
                editImageFile: joi_1.default.any(),
            });
            if (req.file) {
                const editImageFile = req.file;
                if (!["image/jpeg", "image/jpg", "image/png"].includes(editImageFile.mimetype)) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Edit image file must be either a JPG, JPEG or PNG image",
                        data: null,
                    });
                }
                if (req.file.fieldname !== "editImageFile") {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Edit file name is required",
                        data: null,
                    });
                }
            }
            const { error } = editParcelSchema.validate(req.body, { abortEarly: true });
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
    addParcelItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const editParcelSchema = joi_1.default.object({
                parcelId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel id is required.",
                    "any.invalid": "Parcel id must be a valid ObjectId.",
                }),
                name: joi_1.default.string().required().messages({
                    "any.required": "Parcel item name is required.",
                    "string.base": "Parcel item name must be a string.",
                }),
                price: joi_1.default.number().min(1).required().messages({
                    "any.required": "Parcel item price is required.",
                    "number.base": "Parcel item price must be a number.",
                    "number.min": "Parcel item price must be greater than 1.",
                }),
                quantity: joi_1.default.number().integer().min(1).required().messages({
                    "any.required": "Parcel item quantity is required.",
                    "number.base": "Parcel item quantity must be a number.",
                    "number.integer": "Parcel item quantity must be an integer.",
                    "number.min": "Parcel item quantity must be at least 1.",
                }),
                description: joi_1.default.string().required().messages({
                    "any.required": "Parcel item description is required.",
                    "string.base": "Parcel item description must be a string.",
                }),
                imageFile: joi_1.default.any(),
            });
            if (!req.file) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Please upload the parcel item image file",
                    data: null,
                });
            }
            const editImageFile = req.file;
            if (!["image/jpeg", "image/jpg", "image/png"].includes(editImageFile.mimetype)) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Edit image file must be either a JPG, JPEG or PNG image",
                    data: null,
                });
            }
            if (req.file.fieldname !== "imageFile") {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Parcel item image file name is required",
                    data: null,
                });
            }
            const { error } = editParcelSchema.validate(req.body, { abortEarly: true });
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
    validateParcelId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteParcelSchema = joi_1.default.object({
                parcelId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel id is required.",
                    "any.invalid": "Parcel id must be a valid ObjectId.",
                }),
            });
            const { error } = deleteParcelSchema.validate(req.query, {
                abortEarly: true,
            });
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
    deleteParcelItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteParcelSchema = joi_1.default.object({
                parcelId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel id is required.",
                    "any.invalid": "Parcel id must be a valid ObjectId.",
                }),
                parcelItemId: joi_1.default.string()
                    .required()
                    .custom((value, helpers) => {
                    if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                        return helpers.error("any.invalid");
                    }
                    return value;
                })
                    .messages({
                    "any.required": "Parcel item Id is required.",
                    "any.invalid": "Parecl item Id must be a valid ObjectId.",
                }),
            });
            const { error } = deleteParcelSchema.validate(req.query, {
                abortEarly: true,
            });
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
exports.parcelValidator = new ParcelValidator();
