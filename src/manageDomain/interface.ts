import { Document, Types } from "mongoose";
import { ManageDomainStatus, ManageDomainType } from "./enum";

export interface IManageDomain extends Document {
  _id: Types.ObjectId;
  domain: string;
  userId: Types.ObjectId;
  status: ManageDomainStatus;
  type: ManageDomainType;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddDomainInput {
  userId: Types.ObjectId;
  domain: string;
  status: ManageDomainStatus;
  type: ManageDomainType;
  comment: string;
}

export interface IAddDomainUserInput {
  domain: string;
  status: ManageDomainStatus;
  type: ManageDomainType;
  comment: string;
}
