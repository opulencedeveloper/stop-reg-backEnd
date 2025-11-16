import mongoose, { Schema } from "mongoose";
import { IMyBot } from "./interface";

const myBotSchema = new Schema<IMyBot>(
  {
    bot_username: {
      type: String,
      required: true,
      trim: true,
    },
    bot_password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


const MyBot = mongoose.model<IMyBot>(
  "MyBot",
  myBotSchema
);

export default MyBot;
