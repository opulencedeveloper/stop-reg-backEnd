import { Document } from "mongoose";

export interface IMyBot extends Document {
  bot_username: string;
  bot_password: string;
}


export interface ICreateMyBot {
  bot_username: string;
  bot_password: string;
}
