import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { comparePassword } from "../utils/auth";
import { MessageResponse } from "../utils/enum";

import { userService } from "../user/service";
import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { manageDomainService } from "./service";
import { IAddDomainUserInput } from "./interface";

class ManageDomainController {
  public async addDomain(req: Request, res: Response) {
    const body: IAddDomainUserInput = req.body;

    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserById(userId!);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    const domainExists = await manageDomainService.findDomainByName(
      body.domain
    );

    if (domainExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "Domain already exist!",
        data: null,
      });
    }

    const savedManagedDomain = await manageDomainService.addDomain({
      ...body,
      userId: userExists._id,
    });

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Domain added successfully!",
      data: { savedManagedDomain },
    });
  }

  public async fetchUserDomains(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const manageDomains = await manageDomainService.findDomainsByUserId(
      userId!
    );

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Domains fetched successfully!",
      data: manageDomains,
    });
  }
}

export const manageDomainController = new ManageDomainController();
