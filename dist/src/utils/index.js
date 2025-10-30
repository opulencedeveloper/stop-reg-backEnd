"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Utils {
    constructor() {
        this.generateApiToken = () => {
            // Generate 24 random bytes (192 bits of entropy)
            const randomBytes = crypto_1.default.randomBytes(24);
            // Convert to base64 and remove padding characters
            const base64 = randomBytes.toString("base64").replace(/[+/=]/g, (char) => {
                const replacements = {
                    "+": "-",
                    "/": "_",
                    "=": "",
                };
                return replacements[char];
            });
            return base64;
        };
        this.normalizeDomain = (domain) => {
            return domain
                .replace(/^https?:\/\//, "")
                .replace(/\/.*/, "")
                .toLowerCase();
        };
    }
    // Middleware function to wrap controllers with try-catch
    wrapAsync(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }
    customResponse({ res, status, message, description, data, }) {
        return res.status(status).json({
            message,
            description,
            data,
        });
    }
}
exports.utils = new Utils();
