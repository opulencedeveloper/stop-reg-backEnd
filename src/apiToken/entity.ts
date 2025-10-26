import mongoose, { Schema } from "mongoose";
import { IApiToken } from "./interface";

const apiTokenSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApiToken = mongoose.model<IApiToken>("ApiToken", apiTokenSchema);

export default ApiToken;
