import { Request, Response } from "express";
import { MessageResponse } from "../utils/enum";

import { utils } from "../utils";
import {
  IAddEmailDomainUserInput,
  IBulkVerification,
  ICheckDisposableEmail,
} from "./interface";
import { emailDomainService } from "./service";

class EmailDomainController {
  public async addEmailDomain(req: Request, res: Response) {
    const body: IAddEmailDomainUserInput = req.body;

    const savedManagedDomain = await emailDomainService.addEmailDomain(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Domain added successfully!",
      data: savedManagedDomain,
    });
  }

  public async checkDisposableEmail(req: Request, res: Response) {
    const body: ICheckDisposableEmail = req.body;

    const disposableEmail = await emailDomainService.checkDisposableEmail(
      body.email
    );

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Check successful",
      data: disposableEmail,
    });
  }

  public async bulkDomainVerification(req: Request, res: Response) {
    const body: IBulkVerification = req.body;

    const bulkVerification = await emailDomainService.verifyBulkDomains(
      body.domains
    );

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Verification successful",
      data: bulkVerification,
    });
  }
}

export const emailDomainController = new EmailDomainController();
