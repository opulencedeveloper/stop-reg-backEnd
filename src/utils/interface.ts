import { Request, Response } from "express";
import { MessageResponse } from "./enum";
import { Types } from "mongoose";

export interface CustomRequest extends Request {
  userId?: Types.ObjectId;
  buyerId?: Types.ObjectId;
  userType?: string;
}

export interface CustomHttpResponse {
  res: Response;
  status: number;
  message: MessageResponse;
  description: string;
  data: any;
}
