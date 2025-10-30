import { Request, Response } from "express";
import { MessageResponse } from "../utils/enum";

import { utils } from "../utils";
import {
  IAddEmailDomainUserInput,
  IBulkVerification,
  ICheckDisposableEmail,
} from "./interface";
import { emailDomainService } from "./service";
import { CustomRequest } from "../utils/interface";
import { userService } from "../user/service";
import { ISubscriptionPlan } from "../subscriptionPlan/interface";

class EmailDomainController {
  public async addEmailDomain(req: Request, res: Response) {
    const body: IAddEmailDomainUserInput = req.body;
    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserForRateLimit(userId!);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

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
    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserForRateLimit(userId!);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    if (userExists.tokenExpiresAt < new Date()) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "API token has expired. Please renew your subscription.",
        data: null,
      });
    }

    if (userExists.apiRequestLeft !== null) {
      if (userExists.apiRequestLeft === 0) {
        return utils.customResponse({
          status: 403,
          res,
          message: MessageResponse.Error,
          description: "API request limit reached for your current plan.",
          data: null,
        });
      }

      await userService.decrementApiRequestLeft(userId!);
    }

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
    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserForRateLimit(userId!);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    if (userExists.tokenExpiresAt < new Date()) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "API token has expired. Please renew your subscription.",
        data: null,
      });
    }

    if (userExists.apiRequestLeft !== null) {
      if (userExists.apiRequestLeft === 0) {
        return utils.customResponse({
          status: 403,
          res,
          message: MessageResponse.Error,
          description: "API request limit reached for your current plan.",
          data: null,
        });
      }

      await userService.decrementApiRequestLeft(userId!);
    }

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
