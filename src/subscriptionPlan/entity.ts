import mongoose, { Schema } from "mongoose";
import { ISubscriptionPlan } from "./interface";
import { SubPlan } from "./enum";

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(SubPlan),
      unique: true,
    },
    monthlyPrice: {
      type: Number,
      required: true,
    },
    apiLimit: {
      type: Number,
      default: null,
    },
    durationInDays: {
      type: Number,
      default: 30,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;
