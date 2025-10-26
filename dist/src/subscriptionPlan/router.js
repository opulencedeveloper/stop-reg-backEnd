"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const controller_1 = require("../subscriptionPlan/controller");
exports.SubscriptionPlanRouter = (0, express_1.Router)();
// SubscriptionPlanRouter.post(
//   "/plan",
//   [subscriptionPlanValidator.createSubscriptionPlan],
//   utils.wrapAsync(subscriptionPlanController.createSubscriptionPlan)
// );
exports.SubscriptionPlanRouter.get("/plan", utils_1.utils.wrapAsync(controller_1.subscriptionPlanController.fetchSubscriptionPlans));
