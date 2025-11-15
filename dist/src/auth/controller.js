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
exports.authController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../utils/auth");
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const service_1 = require("../subscriptionPlan/service");
const enum_2 = require("../subscriptionPlan/enum");
const service_2 = require("../user/service");
const service_3 = require("./service");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const email = body.email;
            const emailExists = yield service_2.userService.findUserByEmail(email);
            if (emailExists) {
                return utils_1.utils.customResponse({
                    status: 409,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Email already exist!",
                    data: null,
                });
            }
            const plan = yield service_1.subscriptionPlanService.findPlanByName(enum_2.SubPlan.Free);
            console.log(plan);
            if (!plan) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Could not complete!",
                    data: null,
                });
            }
            const tokenExpiresAt = new Date();
            tokenExpiresAt.setDate(tokenExpiresAt.getDate() + plan.durationInDays);
            const apiToken = utils_1.utils.generateApiToken();
            const apiRequestLeft = plan.apiLimit;
            const otp = utils_1.utils.generateOtp();
            const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
            yield service_2.userService.createUser(Object.assign(Object.assign({}, body), { planId: plan._id, tokenExpiresAt,
                apiRequestLeft,
                apiToken, emailVerificationOtp: otp, emailVerificationOtpExpiration: expiryTime }));
            // sendEmailVerificationMail({
            //   email: body.email,
            //   otp: otp,
            //   expiryTime: "5 minutes",
            // });
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "User created successfully!",
                data: null,
            });
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email } = req.body;
            const userExists = yield service_2.userService.findUserByEmail(email);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const isEmailVerified = yield service_3.authService.checkEmailVerificationStatus(email);
            if (!isEmailVerified) {
                const otp = utils_1.utils.generateOtp();
                const email = userExists.email;
                yield service_3.authService.saveOtp({ email, otp });
                // sendEmailVerificationMail({
                //   email,
                //   otp,
                //   expiryTime: "5 minutes",
                // });
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.VerifyEmail,
                    description: `A  verication otp  has been sent to ${email}!`,
                    data: null,
                });
            }
            const match = yield (0, auth_1.comparePassword)(password, userExists.password);
            if (!match) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Wrong user credentials!",
                    data: null,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: userExists._id }, jwtSecret, {
                expiresIn: "30d",
            });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Logged in successfully",
                data: {
                    token,
                },
            });
        });
    }
    emailVerifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const email = body.email;
            const otp = body.otp;
            const userOtpValidity = yield service_3.authService.validateOtp(email, otp);
            if (!userOtpValidity) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid otp",
                    data: userOtpValidity,
                });
            }
            if (userOtpValidity.emailVerified) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Success,
                    description: "Email already verified!",
                    data: null,
                });
            }
            if (userOtpValidity.emailVerificationOtpExpiration !== undefined) {
                const currentDate = new Date();
                const expirationDate = new Date(userOtpValidity.emailVerificationOtpExpiration);
                if (expirationDate < currentDate) {
                    return utils_1.utils.customResponse({
                        status: 400,
                        res,
                        message: enum_1.MessageResponse.Error,
                        description: "Email verification OTP has expired!",
                        data: null,
                    });
                }
                const userExists = yield service_3.authService.verifyEmail(email);
                if (!userExists) {
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
                    description: "Verification successful",
                    data: null,
                });
            }
            else {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Email verification OTP expired",
                    data: null,
                });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userExists = yield service_2.userService.findUserByEmail(body.email);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const otp = utils_1.utils.generateOtp();
            const email = userExists.email;
            yield service_3.authService.saveOtp({ email, otp });
            // sendEmailVerificationMail({
            //   email,
            //   otp,
            //   expiryTime: "5 minutes",
            // });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.VerifyEmail,
                description: `A  verication otp  has been resent to ${email}!`,
                data: null,
            });
        });
    }
}
exports.authController = new AuthController();
