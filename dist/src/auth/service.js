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
exports.authService = void 0;
const entity_1 = __importDefault(require("../user/entity"));
class AuthService {
    validateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(email, otp);
            const otpValidity = yield entity_1.default.findOne({
                email: email,
                emailVerificationOtp: otp,
            });
            return otpValidity;
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield entity_1.default.findOne({ email });
            if (user) {
                user.emailVerified = true;
                user.emailVerificationOtp = undefined;
                user.emailVerificationOtpExpiration = undefined;
                user = yield user.save();
            }
            return user;
        });
    }
    saveOtp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = input;
            const user = yield entity_1.default.findOne({
                email: email,
            });
            user.emailVerificationOtp = otp;
            user.emailVerificationOtpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
            yield user.save();
            return user;
        });
    }
    checkEmailVerificationStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({ email, emailVerified: true });
            return user;
        });
    }
}
exports.authService = new AuthService();
