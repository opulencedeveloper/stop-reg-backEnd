"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDomainRouter = void 0;
const express_1 = require("express");
const is_auth_1 = require("../middleware/is_auth");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
const controller_2 = require("../bot/controller");
exports.EmailDomainRouter = (0, express_1.Router)();
exports.EmailDomainRouter.post("/add", [validator_1.emailDomainValidator.addEmailDomain], utils_1.utils.wrapAsync(controller_1.emailDomainController.addEmailDomain));
exports.EmailDomainRouter.post("/check-disposable-email", [is_auth_1.isAuth, validator_1.emailDomainValidator.checkDisposableEmail], utils_1.utils.wrapAsync(controller_1.emailDomainController.checkDisposableEmail));
exports.EmailDomainRouter.post("/bulk-verification", [is_auth_1.isAuth, validator_1.emailDomainValidator.bulkDomainVerification], utils_1.utils.wrapAsync(controller_1.emailDomainController.bulkDomainVerification.bind(controller_1.emailDomainController)));
exports.EmailDomainRouter.post("/bulk-verification-csv", [is_auth_1.isAuth, validator_1.emailDomainValidator.bulkDomainVerification], utils_1.utils.wrapAsync(controller_1.emailDomainController.bulkDomainVerificationCSV.bind(controller_1.emailDomainController)));
exports.EmailDomainRouter.post("/create-bot", 
// [isAuth, emailDomainValidator.bulkDomainVerification],
utils_1.utils.wrapAsync(controller_2.myBotController.createBot.bind(controller_1.emailDomainController)));
