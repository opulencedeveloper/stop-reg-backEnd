import { Router } from "express";

import { isAuth } from "../middleware/is_auth";
import { utils } from "../utils";
import { emailDomainValidator } from "./validator";
import { emailDomainController } from "./controller";
import { myBotController } from "../bot/controller";

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
  utils.wrapAsync(emailDomainController.bulkDomainVerification.bind(emailDomainController))
);

EmailDomainRouter.post(
  "/bulk-verification-csv",
  [isAuth, emailDomainValidator.bulkDomainVerification],
  utils.wrapAsync(emailDomainController.bulkDomainVerificationCSV.bind(emailDomainController))
);

EmailDomainRouter.post(
  "/create-bot",
  // [isAuth, emailDomainValidator.bulkDomainVerification],
  utils.wrapAsync(myBotController.createBot.bind(myBotController))
);
