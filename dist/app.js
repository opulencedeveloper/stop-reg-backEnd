"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const loggin_1 = __importDefault(require("./src/utils/loggin"));
const enum_1 = require("./src/utils/enum");
const router_1 = require("./src/auth/router");
const general_1 = __importDefault(require("./src/middleware/general"));
const utils_1 = require("./src/utils");
const router_2 = require("./src/subscriptionPlan/router");
const router_3 = require("./src/user/router");
const router_4 = require("./src/manageDomain/router");
const router_5 = require("./src/emailDomains/router");
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const requiredEnvVars = ["MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    loggin_1.default.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}
const StartServer = () => {
    app.set("trust proxy", 1);
    app.use((0, compression_1.default)());
    app.use(general_1.default.Helmet);
    app.use(general_1.default.RateLimiting);
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(",")
            : ["http://127.0.0.1:5500"],
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
    app.use((req, res, next) => {
        const startTime = Date.now();
        loggin_1.default.info(`Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            const duration = Date.now() - startTime;
            loggin_1.default.info(`Outgoing ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}] - duration: [${duration}ms]`);
        });
        next();
    });
    app.use("/api/v1/auth", router_1.AuthRouter);
    app.use("/api/v1/subscription", router_2.SubscriptionPlanRouter);
    app.use("/api/v1/user", router_3.UserRouter);
    app.use("/api/v1/manage/domain", router_4.ManageDomainRouter);
    app.use("/api/v1/email-domains", router_5.EmailDomainRouter);
    app.get("/api/v1/healthcheck", (_req, res) => {
        res.status(200).json({ status: "UP 🔥🔧🎂" });
    });
    app.use((_req, res) => {
        const _error = new Error("Url not found 😟");
        loggin_1.default.error(_error);
        return res.status(404).json({ message: _error.message });
    });
    app.use((err, _req, res, _next) => {
        // Log detailed error information on server (never expose to client)
        loggin_1.default.error(`Error occurred: ${err.message}`);
        loggin_1.default.error(`Error name: ${err.name}`);
        loggin_1.default.error(`Error stack: ${err.stack}`);
        // In production, also log request details for debugging
        if (process.env.NODE_ENV === "production") {
            loggin_1.default.error(`Request URL: ${_req.url}`);
            loggin_1.default.error(`Request Method: ${_req.method}`);
            loggin_1.default.error(`Request IP: ${_req.socket.remoteAddress}`);
        }
        // Return generic error message to frontend (never expose internal details)
        return utils_1.utils.customResponse({
            status: 500,
            res,
            message: enum_1.MessageResponse.Error,
            description: "Internal Server Error",
            data: null,
        });
    });
    const server = app.listen(port, () => loggin_1.default.info(`Server is running on port ${port} 🔥🔧`));
    // Graceful shutdown
    const gracefulShutdown = (signal) => {
        loggin_1.default.info(`${signal} signal received: closing HTTP server`);
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            loggin_1.default.info("HTTP server closed");
            yield mongoose_1.default.connection.close();
            loggin_1.default.info("MongoDB connection closed");
            process.exit(0);
        }));
    };
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};
const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    loggin_1.default.info(`Database connected 🎂`);
    StartServer();
})
    .catch((_error) => {
    loggin_1.default.error("Error while connecting to Database ===> ");
    loggin_1.default.error(_error);
    process.exit(1);
});
