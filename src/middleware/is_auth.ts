import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import { CustomRequest } from "../utils/interface";
import { MessageResponse } from "../utils/enum";
import { utils } from "../utils";
import mongoose from "mongoose";

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: string;
  userType: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return utils.customResponse({
      status: 401,
      res,
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: DecodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    return utils.customResponse({
      status: 401,
      res,
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }

  if (!decodedToken || !decodedToken.userId || !decodedToken.userType) {
    return utils.customResponse({
      status: 401,
      res,
      message: MessageResponse.Error,
      description: "Not authenticated",
      data: null,
    });
  }

  (req as CustomRequest).userId = new mongoose.Types.ObjectId(decodedToken.userId);
  (req as CustomRequest).userType = decodedToken.userType;

  next();
};
