import { Router } from "express";

import { userController } from "./controller";
import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";


export const UserRouter = Router();

UserRouter.get(
  "/info",
  [isAuth],
  utils.wrapAsync(userController.fetchUserDetails)
);
