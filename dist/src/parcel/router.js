"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const controller_1 = require("./controller");
const is_auth_1 = require("../middleware/is_auth");
const general_1 = __importDefault(require("../middleware/general"));
const validator_1 = require("./validator");
const storage = multer_1.default.memoryStorage();
const singleFileUpload = (fieldName) => (0, multer_1.default)({ storage }).single(fieldName);
exports.ItemRouter = (0, express_1.Router)();
//Create Parcel
exports.ItemRouter.post("/create", [
    is_auth_1.isAuth,
    general_1.default.isSeller,
    general_1.default.doesBuyerExist,
    validator_1.parcelValidator.createParcel,
], utils_1.utils.wrapAsync(controller_1.parcelController.createParcel));
//Edit Parcel
exports.ItemRouter.patch("/edit", [
    is_auth_1.isAuth,
    general_1.default.isSeller,
    general_1.default.doesBuyerExist,
    validator_1.parcelValidator.editParcel,
], utils_1.utils.wrapAsync(controller_1.parcelController.editParcel));
exports.ItemRouter.patch("/edit/item", [
    is_auth_1.isAuth,
    general_1.default.isSeller,
    singleFileUpload("editImageFile"),
    validator_1.parcelValidator.editParcelItem,
], utils_1.utils.wrapAsync(controller_1.parcelController.editParcelItem));
exports.ItemRouter.patch("/add/item", [
    is_auth_1.isAuth,
    general_1.default.isSeller,
    singleFileUpload("imageFile"),
    validator_1.parcelValidator.addParcelItem,
], utils_1.utils.wrapAsync(controller_1.parcelController.addParcelItem));
//Delete Parcel
exports.ItemRouter.delete("/delete", [is_auth_1.isAuth, general_1.default.isSeller, validator_1.parcelValidator.validateParcelId], utils_1.utils.wrapAsync(controller_1.parcelController.deleteParcel));
//Delete Parcel Item
exports.ItemRouter.delete("/delete/item", [is_auth_1.isAuth, general_1.default.isSeller, validator_1.parcelValidator.deleteParcelItem], utils_1.utils.wrapAsync(controller_1.parcelController.deleteParcelItem));
//Accept Parcel
exports.ItemRouter.patch("/accept", [is_auth_1.isAuth, general_1.default.isBuyer, validator_1.parcelValidator.validateParcelId], utils_1.utils.wrapAsync(controller_1.parcelController.acceptParcel));
//Decline Parcel
exports.ItemRouter.patch("/decline", [is_auth_1.isAuth, general_1.default.isBuyer, validator_1.parcelValidator.validateParcelId], utils_1.utils.wrapAsync(controller_1.parcelController.declineParcel));
