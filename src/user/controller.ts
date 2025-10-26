import { Request, Response } from "express";
import { CustomRequest } from "../utils/interface";
import { userService } from "./service";
import { utils } from "../utils";
import { MessageResponse } from "../utils/enum";

class UserController {
  public async fetchUserDetails(req: Request, res: Response) {
    const { userId } = req as CustomRequest;

    const userDetails = await userService.findUserById(userId!);

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Logged in successfully",
      data: userDetails,
    });
  }
}

export const userController = new UserController();
