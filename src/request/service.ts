import { Types } from "mongoose";
import Request from "./entity";
import { ISetRequestStatusInput } from "./interface";

class RequestService {
  public async findRequestByUserId(userId: Types.ObjectId) {
    const currentYear = new Date().getFullYear();
    return Request.find({ userId, year: currentYear }).sort({ month: 1 });
  }

  public async findRequestByUserIdAndSetStatus(input: ISetRequestStatusInput) {
    const { userId, success, blocked, planId } = input;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const inc: Record<string, number> = {};
    if (success > 0) inc.success = success;
    if (blocked > 0) inc.blocked = blocked;

    const result = await Request.findOneAndUpdate(
      { userId, month, year },
      {
        $inc: inc,
        $set: { planId }, 
        $setOnInsert: { userId, month, year },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Update total to ensure it equals success + blocked
    if (result) {
      result.total = result.success + result.blocked;
      await result.save();
    }

    return result;
  }
}

export const requestService = new RequestService();
