import mongoose, { Schema, Document, Types } from "mongoose";
import { IRequest } from "./interface";

const requestSchema: Schema<IRequest> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
    blocked: {
      type: Number,
      required: true,
      default: 0,
    },
    success: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
requestSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Request = mongoose.model<IRequest>("Request", requestSchema);

export default Request;
