import { Router } from "express";

import { utils } from "../utils";
import { apiTokenValidator } from "./validator";
import { apiTokenController } from "./controller";

export const ApiTokenRouter = Router();

ApiTokenRouter.get(
  "/:token",
  [apiTokenValidator.validateAPi],
  utils.wrapAsync(apiTokenController.checkEmail)
);
