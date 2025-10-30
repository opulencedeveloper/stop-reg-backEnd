import { Document } from "mongoose";

export interface IEmailDomain extends Document {
  disposable_domain: string;
  mx_record: string;
  public_email_provider: boolean;
  relay_domain: boolean;
}

export interface IAddEmailDomainUserInput {
  disposable_domain: string;
  mx_record: string;
  public_email_provider: boolean;
  relay_domain: boolean;
}

export interface ICheckDisposableEmail {
   email: string
}

export interface IBulkVerification {
   domains: string[]
}