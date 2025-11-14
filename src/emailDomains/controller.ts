import { Request, Response } from "express";
import { Types } from "mongoose";
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
import { manageDomainService } from "../manageDomain/service";
import { requestService } from "../request/service";

class EmailDomainController {
  public async addEmailDomain(req: Request, res: Response) {
    const body: IAddEmailDomainUserInput = req.body;
    const { userId } = req as CustomRequest;

    const domainExist = await emailDomainService.checkIfDomainExist(body.domain);

    if (domainExist) {
      return utils.customResponse({
        status: 409,
        res,
        message: MessageResponse.Error,
        description: "Domain already added!",
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

    // Null means this request is unlimited
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

    await requestService.findRequestByUserIdAndSetStatus({
      planId: userExists.planId as Types.ObjectId,
      blocked: disposableEmail ? 0 : 1,
      success: disposableEmail ? 1 : 0,
      userId: userExists._id,
    });

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

    // Null means this request is unlimited
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

      if (userExists.apiRequestLeft < body.domains.length) {
        return utils.customResponse({
          status: 403,
          res,
          message: MessageResponse.Error,
          description: `Insufficient API requests. You have ${userExists.apiRequestLeft} request(s) remaining, but need ${body.domains.length} for this operation.`,
          data: null,
        });
      }

      await userService.decrementApiRequestLeft(userId!, body.domains.length);
    }

    const bulkVerification = await emailDomainService.verifyBulkDomains(
      body.domains
    );

    // Calculate success and blocked counts
    const successCount = bulkVerification.length; // Domains found in DB = successful
    const blockedCount = body.domains.length - successCount; // Domains not found = blocked

    await requestService.findRequestByUserIdAndSetStatus({
      planId: userExists.planId as Types.ObjectId,
      success: successCount,
      blocked: blockedCount,
      userId: userExists._id,
    });

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
