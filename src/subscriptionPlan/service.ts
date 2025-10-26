import { Types } from "mongoose";
import SubscriptionPlan from "./entity";
import { ICreateSubscriptionPlanUserInput } from "./interface";
import { SubPlan } from "./enum";

class SubscriptionPlanService {
  public async createSubPlan(input: ICreateSubscriptionPlanUserInput) {
    const subPlan = new SubscriptionPlan({
      ...input,
    });

    await subPlan.save();

    return;
  }

  public async findPlanByName(name: SubPlan) {
    const plan = await SubscriptionPlan.findOne({ name });

    return plan;
  }

   public async findPlans() {
    const plans = await SubscriptionPlan.find();

    return plans;
  }
}

export const subscriptionPlanService = new SubscriptionPlanService();
