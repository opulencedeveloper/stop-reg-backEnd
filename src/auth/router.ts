import { Router } from "express";

import { authController } from "./controller";
import { authValidator } from "./validator";
import { utils } from "../utils";
import { subscriptionPlanValidator } from "../subscriptionPlan/validator";
import { subscriptionPlanController } from "../subscriptionPlan/controller";

export const AuthRouter = Router();

AuthRouter.post(
  "/register",
  [authValidator.registerUser],
  utils.wrapAsync(authController.registerUser)
);

AuthRouter.post(
  "/login",
  [authValidator.logIn],
  utils.wrapAsync(authController.logIn)
);

AuthRouter.post(
  "/createplan",
  [subscriptionPlanValidator.createSubscriptionPlan],
  utils.wrapAsync(subscriptionPlanController.createSubscriptionPlan)
);