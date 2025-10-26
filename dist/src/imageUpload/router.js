"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
const is_auth_1 = require("../middleware/is_auth");
exports.ImageUploadRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).single("image");
//Image Upload
exports.ImageUploadRouter.post("/upload/image", [is_auth_1.isAuth, upload, validator_1.imageUploadValidator.imageUpload], 
//I used "bind" because I used "this" in the imageUploadController function
utils_1.utils.wrapAsync(controller_1.imageUploadController.uploadImage.bind(controller_1.imageUploadController)));
//Delete Image
exports.ImageUploadRouter.delete("/upload/image", [is_auth_1.isAuth, validator_1.imageUploadValidator.deleteImage], controller_1.imageUploadController.deleteUploadedImage);
