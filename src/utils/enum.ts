export enum MessageResponse {
  Error = "error",
  Success = "success",
  ResentOtp= "resent_otp",
   VerifyEmail = "verify_email",
}

export enum ErrorName {
  ValidationError = "ValidationError",
  CastError = "CastError",
  JsonWebTokenError = "JsonWebTokenError",
  TokenExpiredError = "TokenExpiredError",
  MongoServerError = "MongoServerError",
  DuplicateKey = "MongoError",
}
