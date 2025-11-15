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
exports.userController = void 0;
const utils_1 = require("../utils");
const enum_1 = require("../utils/enum");
const auth_1 = require("../utils/auth");
const service_1 = require("../request/service");
const service_2 = require("./service");
class UserController {
    fetchUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const userDetails = yield service_2.userService.findUserByIdWithoutPassword(userId);
            const request = yield service_1.requestService.findRequestByUserId(userId);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Logged in successfully",
                data: { userDetails, request },
            });
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserByIdWithPassword(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const match = yield (0, auth_1.comparePassword)(body.currentPassword, userExists.password);
            if (!match) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Current password is not correct!",
                    data: null,
                });
            }
            const updatedUser = yield service_2.userService.editPasswordById({
                password: body.password,
                userId: userId,
            });
            if (!updatedUser) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Password updated successfully",
                data: null,
            });
        });
    }
    regenerateUserToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const apiToken = utils_1.utils.generateApiToken();
            const user = yield service_2.userService.regeneratUserToken(apiToken, userId);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "API token regenerated successfully",
                data: { apiToken },
            });
        });
    }
    updateFullName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserByIdWithPassword(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const updatedUserDetails = yield service_2.userService.updateFulNameByUserId(userId, body.fullName);
            if (!updatedUserDetails) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "FUll name updated successfully",
                data: { updatedUserDetails },
            });
        });
    }
}
exports.userController = new UserController();
