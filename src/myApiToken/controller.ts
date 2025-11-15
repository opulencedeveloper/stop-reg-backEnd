import { Request, Response } from "express";
import { Types } from "mongoose";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import { userService } from "../user/service";
import { emailDomainService } from "../emailDomains/service";
import { requestService } from "../request/service";

class ApiTokenController {
  public async checkEmail(req: Request, res: Response) {
    const token = (req as any).extractedToken as string;
    const email = (req as any).extractedEmail as string;

    const userExists = await userService.findUserByApiToken(token);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "Invalid API token.",
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

      await userService.decrementApiRequestLeftByAPIToken(token);
    }

    const disposableEmail = await emailDomainService.checkDisposableEmail(
      email
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
      data: { isDisposable: !!disposableEmail },
    });
  }
}

export const apiTokenController = new ApiTokenController();
