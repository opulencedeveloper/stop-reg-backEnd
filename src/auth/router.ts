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
  "/verfy/email",
  [authValidator.verifyEmail],
  utils.wrapAsync(authController.emailVerifyOtp)
);

AuthRouter.post(
  "/resend/email",
  [authValidator.validateEmail],
  utils.wrapAsync(authController.resendOtp)
);

// AuthRouter.post(
//   "/createplan",
//   [subscriptionPlanValidator.createSubscriptionPlan],
//   utils.wrapAsync(subscriptionPlanController.createSubscriptionPlan)
// );