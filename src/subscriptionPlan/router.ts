import { Router } from "express";

import { utils } from "../utils";
import { subscriptionPlanController } from "../subscriptionPlan/controller";
import { subscriptionPlanValidator } from "./validator";

export const SubscriptionPlanRouter = Router();

SubscriptionPlanRouter.post(
  "/plan",
  [subscriptionPlanValidator.createSubscriptionPlan],
  utils.wrapAsync(subscriptionPlanController.createSubscriptionPlan)
);

SubscriptionPlanRouter.get(
  "/plan",
  utils.wrapAsync(subscriptionPlanController.fetchSubscriptionPlans)
);