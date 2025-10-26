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

  public generateApiToken = (): string => {
    // Generate 24 random bytes (192 bits of entropy)
    const randomBytes = Crypto.randomBytes(24);
    
    // Convert to base64 and remove padding characters
    const base64 = randomBytes.toString('base64').replace(/[+/=]/g, (char) => {
      const replacements: { [key: string]: string } = { 
        '+': '-', 
        '/': '_', 
        '=': '' 
      };
      return replacements[char];
    });
    
    return base64;
  };
}

export const utils = new Utils();
