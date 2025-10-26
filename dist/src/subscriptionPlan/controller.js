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
exports.subscriptionPlanController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const service_1 = require("./service");
dotenv_1.default.config();
class SubscriptionPlanController {
    createSubscriptionPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            yield service_1.subscriptionPlanService.createSubPlan(body);
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Subscription plan created successfully!",
                data: null,
            });
        });
    }
    fetchSubscriptionPlans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield service_1.subscriptionPlanService.findPlans();
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Subscription plan retrived successfully!",
                data: { plans },
            });
        });
    }
}
exports.subscriptionPlanController = new SubscriptionPlanController();
