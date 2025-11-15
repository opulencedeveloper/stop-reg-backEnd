import { Router } from "express";

import { userController } from "./controller";
import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";
import { userValidator } from "./validator";

export const UserRouter = Router();

UserRouter.get(
  "/info",
  [isAuth],
  utils.wrapAsync(userController.fetchUserDetails)
);

UserRouter.patch(
  "/update/password",
  [isAuth, userValidator.updateUserPassword],
  utils.wrapAsync(userController.updatePassword)
);

UserRouter.patch(
  "/update/fullname",
  [isAuth, userValidator.updateFullName],
  utils.wrapAsync(userController.updateFullName)
);

UserRouter.patch(
  "/regenerate/token",
  [isAuth],
  utils.wrapAsync(userController.regenerateUserToken)
);
