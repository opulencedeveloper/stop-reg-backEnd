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

export interface ISendEmail {
  receiverEmail: string;
  subject: string;
  emailTemplate: string;
}

export interface IOTP {
  email: string;
  otp: string;
}

export interface IValidateEmail {
  email: string;
}

export interface IVerificationEmail extends IOTP {
  expiryTime: string;
}

export type IVerifyEmail = IOTP;