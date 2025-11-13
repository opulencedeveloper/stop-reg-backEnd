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
      trim: true,
      required: true,
    },
    apiToken: {
      type: String,
      trim: true,
      required: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
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
      emailVerified: {
      type: Boolean,
      default: false,
      index: true, 
    },
    emailVerificationOtp: {
      type: String,
      trim: true,
      default: undefined,
    },
    emailVerificationOtpExpiration: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

//TODO

//Change Ok to Mx Record
//UNRESOLVABLE: To Public email provider
//ERROR: to disposable