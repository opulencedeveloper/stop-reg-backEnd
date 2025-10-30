import mongoose, { Schema, Types } from "mongoose";
import { IManageDomain } from "./interface";
import { ManageDomainStatus, ManageDomainType } from "./enum";

const manageDomainSchema = new Schema<IManageDomain>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ManageDomainStatus),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ManageDomainType),
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
   domain: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

manageDomainSchema.index({ userId: 1 });
manageDomainSchema.index({ status: 1, type: 1 });

const ManageDomain = mongoose.model<IManageDomain>("ManageDomain", manageDomainSchema);

export default ManageDomain;
