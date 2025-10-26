import mongoose, { Schema } from "mongoose";
import { IUser } from "./interface";

const userSchema: Schema = new Schema(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    apiToken: {
      type: String,
      required: true,
    },
    apiRequestLeft: {
      type: Number,
      default: null,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
