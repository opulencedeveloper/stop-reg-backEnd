import mongoose, { Schema } from "mongoose";
import { IEmailDomain } from "./interface";

const emailDomainSchema = new Schema<IEmailDomain>(
  {
    disposable_domain: {
      type: String,
      required: true,
      lowercase: true, 
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
    relay_domain: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

emailDomainSchema.index({ disposable_domain: 1 }, { unique: true });
emailDomainSchema.index({ public_email_provider: 1 });
emailDomainSchema.index({ relay_domain: 1 });

const EmailDomain = mongoose.model<IEmailDomain>("EmailDomain", emailDomainSchema);

export default EmailDomain;
