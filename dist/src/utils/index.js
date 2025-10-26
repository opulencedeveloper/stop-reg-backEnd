"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
class Utils {
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
