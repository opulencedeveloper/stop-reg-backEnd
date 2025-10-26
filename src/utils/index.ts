import { NextFunction, Request, Response } from "express";
import Crypto from "crypto";

import { MessageResponse } from "./enum";
import { CustomHttpResponse } from "./interface";

class Utils {
  // Middleware function to wrap controllers with try-catch
  public wrapAsync(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }

  public customResponse({
    res,
    status,
    message,
    description,
    data,
  }: CustomHttpResponse) {
    return res.status(status).json({
      message,
      description,
      data,
    });
  }
}

export const utils = new Utils();
