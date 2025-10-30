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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailDomainController = void 0;
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const service_1 = require("./service");
const service_2 = require("../user/service");
class EmailDomainController {
    addEmailDomain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserForRateLimit(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const savedManagedDomain = yield service_1.emailDomainService.addEmailDomain(body);
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Domain added successfully!",
                data: savedManagedDomain,
            });
        });
    }
    checkDisposableEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserForRateLimit(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            if (userExists.tokenExpiresAt < new Date()) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "API token has expired. Please renew your subscription.",
                    data: null,
                });
            }
            if (userExists.apiRequestLeft !== null) {
                if (userExists.apiRequestLeft === 0) {
                    return utils_1.utils.customResponse({
                        status: 403,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "API request limit reached for your current plan.",
                        data: null,
                    });
                }
                yield service_2.userService.decrementApiRequestLeft(userId);
            }
            const disposableEmail = yield service_1.emailDomainService.checkDisposableEmail(body.email);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Check successful",
                data: disposableEmail,
            });
        });
    }
    bulkDomainVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserForRateLimit(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            if (userExists.tokenExpiresAt < new Date()) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "API token has expired. Please renew your subscription.",
                    data: null,
                });
            }
            if (userExists.apiRequestLeft !== null) {
                if (userExists.apiRequestLeft === 0) {
                    return utils_1.utils.customResponse({
                        status: 403,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "API request limit reached for your current plan.",
                        data: null,
                    });
                }
                yield service_2.userService.decrementApiRequestLeft(userId);
            }
            const bulkVerification = yield service_1.emailDomainService.verifyBulkDomains(body.domains);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Verification successful",
                data: bulkVerification,
            });
        });
    }
}
exports.emailDomainController = new EmailDomainController();
