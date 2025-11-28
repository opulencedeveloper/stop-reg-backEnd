import { Document, Types } from "mongoose";
import { ISubscriptionPlan } from "../subscriptionPlan/interface";

export interface IUser extends Document {
  _id: Types.ObjectId;
  planId: Types.ObjectId | ISubscriptionPlan;
  fullName?: string;
  tokenExpiresAt: Date;
  apiToken: string;
  apiRequestLeft: number;
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterInput {
  planId: Types.ObjectId;
  tokenExpiresAt: Date;
  apiRequestLeft: number | null;
  apiToken: string;
  email: string;
  password: string;
   emailVerificationOtp: string;
  emailVerificationOtpExpiration: Date;
}

export interface IUpdatePasswordUserInput {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdatePasswordInput {
  password: string;
  userId: Types.ObjectId;
}

export interface IUpdateFullNameUserInput {
  fullName: string;
}

