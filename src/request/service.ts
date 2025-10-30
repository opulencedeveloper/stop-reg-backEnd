import { Types } from "mongoose";
import Request from "./entity";
import { RequestType } from "./enum";

class RequestService {
  public async findRequestByUserId(userId: Types.ObjectId) {
    const currentYear = new Date().getFullYear();
    return Request.find({ userId, year: currentYear }).sort({ month: 1 });
  }

  public async findRequestByUserIdAndSetStatus(
    userId: Types.ObjectId,
    type: RequestType,
    planId: Types.ObjectId
  ) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const inc: Record<string, number> = { total: 1 };
    if (type === RequestType.Success) inc.success = 1;
    else if (type === RequestType.Blocked) inc.blocked = 1;

    const result = await Request.findOneAndUpdate(
      { userId, month, year },
      {
        $inc: inc,
        $set: { planId }, 
        $setOnInsert: { userId, month, year, success: 0, blocked: 0, total: 0 },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return result;
  }
}

export const requestService = new RequestService();
