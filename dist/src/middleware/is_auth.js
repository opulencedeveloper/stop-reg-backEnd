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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return utils_1.utils.customResponse({
            status: 401,
            res,
            message: enum_1.MessageResponse.Error,
            description: "Not authenticated",
            data: null,
        });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        return utils_1.utils.customResponse({
            status: 401,
            res,
            message: enum_1.MessageResponse.Error,
            description: "Not authenticated",
            data: null,
        });
    }
    if (!decodedToken || !decodedToken.userId) {
        return utils_1.utils.customResponse({
            status: 401,
            res,
            message: enum_1.MessageResponse.Error,
            description: "Not authenticated",
            data: null,
        });
    }
    req.userId = new mongoose_1.default.Types.ObjectId(decodedToken.userId);
    next();
});
exports.isAuth = isAuth;
