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
import { myBotService } from "../bot/service";
import { comparePassword } from "../utils/auth";

class EmailDomainController {
  // Helper function to deduplicate domains by normalizing them
  private deduplicateDomains(domains: string[]): string[] {
    const normalizedToOriginal = new Map<string, string>();
    const uniqueDomains: string[] = [];

    for (const domain of domains) {
      const normalized = utils.normalizeDomain(domain.toLowerCase());
      if (!normalizedToOriginal.has(normalized)) {
        normalizedToOriginal.set(normalized, domain);
        uniqueDomains.push(domain);
      }
    }

    return uniqueDomains;
  }

  public async addEmailDomain(req: Request, res: Response) {
    const body: IAddEmailDomainUserInput = req.body;
    const { userId } = req as CustomRequest;

    const myBot = await myBotService.findBotByUsername(body.bot_username);

    if (!myBot) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Permision denied!",
        data: null,
      });
    }

    const match = await comparePassword(body.bot_password, myBot.bot_password);

    if (!match) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Permision denied!",
        data: null,
      });
    }

    const domainExist = await emailDomainService.checkIfDomainExist(
      body.domain
    );

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
      data: { isDisposable: !!disposableEmail },
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

    // Deduplicate domains first (remove duplicates like http://example.com, http://example.com/, etc.)
    const uniqueDomains = this.deduplicateDomains(body.domains);

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

      if (userExists.apiRequestLeft < uniqueDomains.length) {
        return utils.customResponse({
          status: 403,
          res,
          message: MessageResponse.Error,
          description: `Insufficient API requests. You have ${userExists.apiRequestLeft} request(s) remaining, but need ${uniqueDomains.length} for this operation.`,
          data: null,
        });
      }

      await userService.decrementApiRequestLeft(userId!, uniqueDomains.length);
    }

    // Normalize unique domains for database lookup
    const normalizedDomains = uniqueDomains.map((domain) =>
      utils.normalizeDomain(domain.toLowerCase())
    );

    const foundDomains = await emailDomainService.verifyBulkDomains(
      normalizedDomains
    );
    const foundDomainSet = new Set(
      foundDomains.map((d) => utils.normalizeDomain(d.domain))
    );

    // Map each unique domain to its disposable status
    const results = uniqueDomains.map((domain) => {
      const normalizedDomain = utils.normalizeDomain(domain.toLowerCase());
      const isDisposable = foundDomainSet.has(normalizedDomain);

      return {
        domain,
        isDisposable,
      };
    });

    // Calculate success and blocked counts
    const successCount = foundDomains.length; // Domains found in DB = successful
    const blockedCount = uniqueDomains.length - successCount; // Domains not found = blocked

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
      data: results,
    });
  }

  public async bulkDomainVerificationCSV(req: Request, res: Response) {
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

    // Deduplicate domains first (remove duplicates like http://example.com, http://example.com/, etc.)
    const uniqueDomains = this.deduplicateDomains(body.domains);

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

      if (userExists.apiRequestLeft < uniqueDomains.length) {
        return utils.customResponse({
          status: 403,
          res,
          message: MessageResponse.Error,
          description: `Insufficient API requests. You have ${userExists.apiRequestLeft} request(s) remaining, but need ${uniqueDomains.length} for this operation.`,
          data: null,
        });
      }

      await userService.decrementApiRequestLeft(userId!, uniqueDomains.length);
    }

    // Normalize unique domains for database lookup
    const normalizedDomains = uniqueDomains.map((domain) =>
      utils.normalizeDomain(domain.toLowerCase())
    );

    const foundDomains = await emailDomainService.verifyBulkDomains(
      normalizedDomains
    );
    const foundDomainSet = new Set(
      foundDomains.map((d) => utils.normalizeDomain(d.domain))
    );

    // Map each unique domain to its disposable status
    const results = uniqueDomains.map((domain) => {
      const normalizedDomain = utils.normalizeDomain(domain.toLowerCase());
      const isDisposable = foundDomainSet.has(normalizedDomain);

      return {
        domain,
        isDisposable,
      };
    });

    // Calculate success and blocked counts
    const successCount = foundDomains.length; // Domains found in DB = successful
    const blockedCount = uniqueDomains.length - successCount; // Domains not found = blocked

    await requestService.findRequestByUserIdAndSetStatus({
      planId: userExists.planId as Types.ObjectId,
      success: successCount,
      blocked: blockedCount,
      userId: userExists._id,
    });

    // Generate CSV
    const csvHeader = "domain,Is Disposable\n";
    const csvRows = results.map((result) => {
      // Escape commas and quotes in domain
      const escapedDomain =
        result.domain.includes(",") || result.domain.includes('"')
          ? `"${result.domain.replace(/"/g, '""')}"`
          : result.domain;
      return `${escapedDomain},${result.isDisposable ? "Yes" : "No"}`;
    });

    const csvContent = csvHeader + csvRows.join("\n");

    // Set headers for CSV download
    const filename = `domain-verification-${Date.now()}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(200).send(csvContent);
  }
}

export const emailDomainController = new EmailDomainController();
