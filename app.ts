import express, { NextFunction, Request, Response, Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import compression from "compression";
import { Server as HttpServer } from "http";

import Logging from "./src/utils/loggin";
import { ErrorName, MessageResponse } from "./src/utils/enum";
import { AuthRouter } from "./src/auth/router";
import GeneralMiddleware from "./src/middleware/general";
import { utils } from "./src/utils";
import { SubscriptionPlanRouter } from "./src/subscriptionPlan/router";
import { UserRouter } from "./src/user/router";
import { ManageDomainRouter } from "./src/manageDomain/router";

const app: Express = express();

dotenv.config();

const port = process.env.PORT || 8080;

const requiredEnvVars = ["MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  Logging.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const StartServer = () => {
  app.set("trust proxy", 1);

  app.use(compression());

  app.use(GeneralMiddleware.Helmet);

  app.use(GeneralMiddleware.RateLimiting);

  app.use(
    cors({
      origin: ["http://127.0.0.1:5500"],
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    Logging.info(
      `Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      Logging.info(
        `Outgoing ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}] - duration: [${duration}ms]`
      );
    });

    next();
  });

  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/subscription", SubscriptionPlanRouter);
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/manage/domain", ManageDomainRouter);

  app.get("/api/v1/healthcheck", (_req: Request, res: Response) => {
    res.status(200).json({ status: "UP 🔥🔧🎂" });
  });

  app.use((_req: Request, res: Response) => {
    const _error = new Error("Url not found 😟");

    Logging.error(_error);

    return res.status(404).json({ message: _error.message });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Log detailed error information on server (never expose to client)
    Logging.error(`Error occurred: ${err.message}`);
    Logging.error(`Error name: ${err.name}`);
    Logging.error(`Error stack: ${err.stack}`);
    
    // In production, also log request details for debugging
    if (process.env.NODE_ENV === "production") {
      Logging.error(`Request URL: ${_req.url}`);
      Logging.error(`Request Method: ${_req.method}`);
      Logging.error(`Request IP: ${_req.socket.remoteAddress}`);
    }

    // Return generic error message to frontend (never expose internal details)
    return utils.customResponse({
      status: 500,
      res,
      message: MessageResponse.Error,
      description: "Internal Server Error",
      data: null,
    });
  });

  const server: HttpServer = app.listen(port, () =>
    Logging.info(`Server is running on port ${port} 🔥🔧`)
  );
};

const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    Logging.info(`Database connected 🎂`);

    StartServer();
  })
  .catch((_error) => {
    Logging.error("Error while connecting to Database ===> ");

    Logging.error(_error);

    process.exit(1);
  });
