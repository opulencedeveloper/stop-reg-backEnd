"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
const is_auth_1 = require("../middleware/is_auth");
const general_1 = __importDefault(require("../middleware/general"));
exports.ItemRouter = (0, express_1.Router)();
//Create Item
exports.ItemRouter.post("/create/item", [is_auth_1.isAuth, general_1.default.isSeller, validator_1.itemValidator.validateUserInputItem], utils_1.utils.wrapAsync(controller_1.itemController.createItem));
//Edit Item
exports.ItemRouter.patch("/edit/item", [is_auth_1.isAuth, general_1.default.isSeller, validator_1.itemValidator.editSellerItem], utils_1.utils.wrapAsync(controller_1.itemController.editSellerItem));
