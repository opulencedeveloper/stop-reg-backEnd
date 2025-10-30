import { Router } from "express";

import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";
import { emailDomainValidator } from "./validator";
import { emailDomainController } from "./controller";

export const EmailDomainRouter = Router();

EmailDomainRouter.post(
  "/add",
  [emailDomainValidator.addEmailDomain],
  utils.wrapAsync(emailDomainController.addEmailDomain)
);

EmailDomainRouter.post(
  "/check-disposable-email",
  [isAuth, emailDomainValidator.checkDisposableEmail],
  utils.wrapAsync(emailDomainController.checkDisposableEmail)
);

EmailDomainRouter.post(
  "/bulk-verification",
  [isAuth, emailDomainValidator.bulkDomainVerification],
  utils.wrapAsync(emailDomainController.bulkDomainVerification)
);
