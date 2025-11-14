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
exports.userService = void 0;
const auth_1 = require("../utils/auth");
const entity_1 = __importDefault(require("./entity"));
class UserService {
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = input.password;
            const hashedPassword = (yield (0, auth_1.hashPassword)(password));
            const user = new entity_1.default(Object.assign(Object.assign({}, input), { password: hashedPassword }));
            yield user.save();
            return;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({
                email,
            });
            return user;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(userId).lean();
            return user;
        });
    }
    findUserByIdWithoutPassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(id)
                .select("-password")
                .populate("planId", "name monthlyPrice apiLimit durationInDays isRecommended")
                .lean();
            return user;
        });
    }
    findUserByIdWithPassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findById(id).lean();
            return user;
        });
    }
    editPasswordById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, password } = input;
            const hashedPassword = (yield (0, auth_1.hashPassword)(password));
            const updatedMenu = yield entity_1.default.findOneAndUpdate({ _id: userId }, { $set: { password: hashedPassword } }, { new: true, runValidators: true });
            return updatedMenu;
        });
    }
    regeneratUserToken(apiToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedMenu = yield entity_1.default.findOneAndUpdate({ _id: userId }, { $set: { apiToken } }, { new: true, runValidators: true });
            return updatedMenu;
        });
    }
    decrementApiRequestLeft(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, amount = 1) {
            const updatedUser = yield entity_1.default.findOneAndUpdate({ _id: userId, apiRequestLeft: { $gt: 0 } }, { $inc: { apiRequestLeft: -amount } }, { new: true, projection: { _id: 1, apiRequestLeft: 1 } }).lean();
            return updatedUser;
        });
    }
    findUserForRateLimit(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return entity_1.default.findById(userId)
                .select("_id tokenExpiresAt apiRequestLeft planId")
                .lean();
        });
    }
}
exports.userService = new UserService();
