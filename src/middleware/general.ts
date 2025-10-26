import helmet from "helmet";
import rateLimit from "express-rate-limit";

export default class GeneralMiddleware {
  static Helmet = helmet({
    crossOriginResourcePolicy: false,
  });

  static RateLimiting = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
}
