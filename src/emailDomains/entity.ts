import mongoose, { Schema } from "mongoose";
import { IEmailDomain } from "./interface";

const emailDomainSchema = new Schema<IEmailDomain>(
  {
    // bot_username: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
  
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    mx_record: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    public_email_provider: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
emailDomainSchema.index({ public_email_provider: 1 });

const EmailDomain = mongoose.model<IEmailDomain>(
  "EmailDomain",
  emailDomainSchema
);

export default EmailDomain;
