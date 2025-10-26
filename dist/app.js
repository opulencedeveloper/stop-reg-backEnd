"use strict";
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
        origin: ["http://localhost:3000"],
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
    app.get("/api/v1/healthcheck", (_req, res) => {
        res.status(200).json({ status: "UP 🔥🔧🎂" });
    });
    app.use((_req, res) => {
        const _error = new Error("Url not found 😟");
        loggin_1.default.error(_error);
        return res.status(404).json({ message: _error.message });
    });
    app.use((err, _req, res, _next) => {
        loggin_1.default.error(`Error occurred: ${err.message}`);
        loggin_1.default.error(err.stack);
        if (err.name === enum_1.ErrorName.ValidationError) {
            return utils_1.utils.customResponse({
                status: 400,
                res,
                message: enum_1.MessageResponse.Error,
                description: "Validation Error",
                data: null,
            });
        }
        if (err.name === enum_1.ErrorName.CastError) {
            return utils_1.utils.customResponse({
                status: 400,
                res,
                message: enum_1.MessageResponse.Error,
                description: "Invalid ID format",
                data: null,
            });
        }
        if (err.name === enum_1.ErrorName.JsonWebTokenError) {
            return utils_1.utils.customResponse({
                status: 401,
                res,
                message: enum_1.MessageResponse.Error,
                description: "Invalid token",
                data: null,
            });
        }
        if (err.name === enum_1.ErrorName.TokenExpiredError) {
            return utils_1.utils.customResponse({
                status: 401,
                res,
                message: enum_1.MessageResponse.Error,
                description: "Token expired",
                data: null,
            });
        }
        if (err.name === enum_1.ErrorName.MongoServerError && err.code === 11000) {
            return utils_1.utils.customResponse({
                status: 409,
                res,
                message: enum_1.MessageResponse.Error,
                description: "Duplicate key error",
                data: null,
            });
        }
        return utils_1.utils.customResponse({
            status: err.status || 500,
            res,
            message: enum_1.MessageResponse.Error,
            description: process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,
            data: null,
        });
    });
    const server = app.listen(port, () => loggin_1.default.info(`Server is running on port ${port} 🔥🔧`));
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
