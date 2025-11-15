import { Router } from "express";

import { utils } from "../utils";
import { apiTokenController } from "./controller";
import { apiTokenValidator } from "./validator";

export const MyApiTokenRouter = Router();

MyApiTokenRouter.get(
  "/:token",
  [apiTokenValidator.validateAPi],
  utils.wrapAsync(apiTokenController.checkEmail)
);
 