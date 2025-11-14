import { Document, Types } from "mongoose";

export interface IRequest extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  month: number;
  year: number;
  blocked: number;
  success: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISetRequestStatusInput {
  userId: Types.ObjectId;
  success: number;
  blocked: number;
  planId: Types.ObjectId;
}