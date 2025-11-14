import { Router } from "express";

import { manageDomainController } from "./controller";
import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";
import { manageDomainValidator } from "./validator";

export const ManageDomainRouter = Router();

ManageDomainRouter.post(
  "/add",
  [isAuth, manageDomainValidator.addDomain],
  utils.wrapAsync(manageDomainController.addDomain)
);

ManageDomainRouter.get(
  "/fetch",
  [isAuth],
  utils.wrapAsync(manageDomainController.fetchUserDomains)
);

ManageDomainRouter.delete(
  "/delete",
  [isAuth, manageDomainValidator.validateDomainId],
  utils.wrapAsync(manageDomainController.deleteDomain)
);