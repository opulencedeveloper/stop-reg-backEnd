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
exports.requestService = void 0;
const entity_1 = __importDefault(require("./entity"));
class RequestService {
    findRequestByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentYear = new Date().getFullYear();
            return entity_1.default.find({ userId, year: currentYear }).sort({ month: 1 });
        });
    }
    findRequestByUserIdAndSetStatus(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, success, blocked, planId } = input;
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const inc = {};
            if (success > 0)
                inc.success = success;
            if (blocked > 0)
                inc.blocked = blocked;
            const result = yield entity_1.default.findOneAndUpdate({ userId, month, year }, {
                $inc: inc,
                $set: { planId },
                $setOnInsert: { userId, month, year },
            }, { upsert: true, new: true, runValidators: true });
            // Update total to ensure it equals success + blocked
            if (result) {
                result.total = result.success + result.blocked;
                yield result.save();
            }
            return result;
        });
    }
}
exports.requestService = new RequestService();
