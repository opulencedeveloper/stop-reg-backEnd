"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const is_auth_1 = require("../middleware/is_auth");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
exports.TransactionRouter = (0, express_1.Router)();
//Deposit
exports.TransactionRouter.post("/deposit", [
    is_auth_1.isAuth,
    validator_1.transactionValidator.deposit,
], utils_1.utils.wrapAsync(controller_1.transactionController.initializeDepositWithMonify));
//Monnfy WebHook
exports.TransactionRouter.post("/monnify-webhook", utils_1.utils.wrapAsync(controller_1.transactionController.monnifyWebhookUrl));
