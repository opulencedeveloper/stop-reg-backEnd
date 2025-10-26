import { Router } from "express";

import { userController } from "./controller";
import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";
import GeneralMiddleware from "../middleware/general";


export const UserRouter = Router();

// UserRouter.get(
//   "/buyer/search",
//   [userValidator.validateUserNameQuery],
//   utils.wrapAsync(userController.searchBuyers)
// );

