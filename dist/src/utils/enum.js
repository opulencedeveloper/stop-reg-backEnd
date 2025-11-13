"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorName = exports.MessageResponse = void 0;
var MessageResponse;
(function (MessageResponse) {
    MessageResponse["Error"] = "error";
    MessageResponse["Success"] = "success";
    MessageResponse["ResentOtp"] = "resent_otp";
    MessageResponse["VerifyEmail"] = "verify_email";
})(MessageResponse || (exports.MessageResponse = MessageResponse = {}));
var ErrorName;
(function (ErrorName) {
    ErrorName["ValidationError"] = "ValidationError";
    ErrorName["CastError"] = "CastError";
    ErrorName["JsonWebTokenError"] = "JsonWebTokenError";
    ErrorName["TokenExpiredError"] = "TokenExpiredError";
    ErrorName["MongoServerError"] = "MongoServerError";
    ErrorName["DuplicateKey"] = "MongoError";
})(ErrorName || (exports.ErrorName = ErrorName = {}));
