import { Document } from "mongoose";

export interface IEmailDomain extends Document {
  // bot_username: string;
  // bot_password: string;
  domain: string;
  mx_record: string;
  public_email_provider: boolean;
}

export interface IAddEmailDomainUserInput {
  bot_username: string;
  bot_password: string;
  domain: string;
  mx_record: string;
  public_email_provider: boolean;
}

export interface ICheckDisposableEmail {
   email: string
}

export interface IBulkVerification {
   domains: string[]
}