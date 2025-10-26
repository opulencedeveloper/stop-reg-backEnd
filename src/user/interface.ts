import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  planId: Types.ObjectId;
  tokenExpiresAt: Date;
  apiToken: string;
  apiRequestLeft: number | null;
  email: string;
  password: string;
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
}
