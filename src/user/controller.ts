import { Request, Response } from "express";
import { CustomRequest } from "../utils/interface";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";
import { IUpdatePasswordUserInput } from "./interface";
import { comparePassword } from "../utils/auth";
import { requestService } from "../request/service";
import { userService } from "./service";

class UserController {
  public async fetchUserDetails(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userDetails = await userService.findUserByIdWithoutPassword(userId!);

    const request = await requestService.findRequestByUserId(userId!);

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: { userDetails, request },
    });
  }

  public async updatePassword(req: Request, res: Response) {
    const body: IUpdatePasswordUserInput = req.body;

    const { userId } = req as CustomRequest;

    const userExists = await userService.findUserByIdWithPassword(userId!);

    if (!userExists) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    const match = await comparePassword(
      body.currentPassword,
      userExists.password
    );

    if (!match) {
      return utils.customResponse({
        status: 400,
        res,
        message: MessageResponse.Error,
        description: "Current password is not correct!",
        data: null,
      });
    }

    const updatedUser = await userService.editPasswordById({
      password: body.password,
      userId: userId!,
    });

    if (!updatedUser) {
      return utils.customResponse({
        status: 404,
        res,
        message: MessageResponse.Error,
        description: "User not found!",
        data: null,
      });
    }

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Password updated successfully",
      data: null,
    });
  }

  public async regenerateUserToken(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const apiToken = utils.generateApiToken();

    const user = await userService.regeneratUserToken(apiToken, userId!);

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "API token regenerated successfully",
      data: { apiToken },
    });
  }
}

export const userController = new UserController();
