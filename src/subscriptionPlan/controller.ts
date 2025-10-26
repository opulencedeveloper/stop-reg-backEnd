import { Request, Response } from "express";
import dotenv from "dotenv";

import { MessageResponse } from "../utils/enum";
import { ICreateSubscriptionPlanUserInput } from "./interface";
import { utils } from "../utils";
import { subscriptionPlanService } from "./service";

dotenv.config();

class SubscriptionPlanController {
  public async createSubscriptionPlan(req: Request, res: Response) {
    const body: ICreateSubscriptionPlanUserInput = req.body;

    await subscriptionPlanService.createSubPlan(body);

    return utils.customResponse({
      status: 201,
      res,
      message: MessageResponse.Success,
      description: "Subscription plan created successfully!",
      data: null,
    });
  }

  public async fetchSubscriptionPlans(req: Request, res: Response) {
    const plans = await subscriptionPlanService.findPlans();

    return utils.customResponse({
      status: 200,
      res,
      message: MessageResponse.Success,
      description: "Subscription plan retrived successfully!",
      data: { plans },
    });
  }
}

export const subscriptionPlanController = new SubscriptionPlanController();
