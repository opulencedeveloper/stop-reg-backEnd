import { Document, Types } from "mongoose";

export interface IRequest extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  month: number;
  year: number;
  blocked: number;
  success: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}