import { Request, Response } from "express";
import { Types } from "mongoose";
import { MessageResponse } from "../utils/enum";

import { utils } from "../utils";
import { CustomRequest } from "../utils/interface";
import { ICreateMyBot } from "./interface";
import { myBotService } from "./service";

class MyBotController {

  public async createBot(req: Request, res: Response) {
    const body: ICreateMyBot = req.body;

    const domainExist = await myBotService.findBotByUsername(body.bot_username);

    if (domainExist) {
      return utils.customResponse({
        status: 409,
        res,
        message: MessageResponse.Error,
        description: "Bot already added!",
        data: null,
      });
    }

    const savedManagedDomain = await myBotService.createBot(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Bot created successfully!",
      data: savedManagedDomain,
    });
  }

}

export const myBotController = new MyBotController();
