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
exports.imageUploadValidator = void 0;
const enum_1 = require("../utils/enum");
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
class ImageUploadValidator {
    imageUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Please upload a file!",
                    data: null,
                });
            }
            const image = req.file;
            if (!["image/jpeg", "image/jpg", "image/png"].includes(image.mimetype)) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Image image file must be either a JPG, JPEG or PNG image",
                    data: null,
                });
            }
            if (req.file.fieldname !== "image") {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Imae file name is required",
                    data: null,
                });
            }
            return next();
        });
    }
    deleteImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                imageUrl: joi_1.default.string().uri().required().messages({
                    "any.required": "Image URL is required.",
                    "string.uri": "Image URL must be a valid URI.",
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
}
exports.imageUploadValidator = new ImageUploadValidator();
