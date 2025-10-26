import { Types } from "mongoose";

export interface IRegisterUserInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterUserInput {
  email: string;
  password: string;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}
