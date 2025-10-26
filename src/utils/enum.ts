export enum MessageResponse {
  Error = "error",
  Success = "success",
  ResentOtp= "resent_otp"
}

export enum ErrorName {
  ValidationError = "ValidationError",
  CastError = "CastError",
  JsonWebTokenError = "JsonWebTokenError",
  TokenExpiredError = "TokenExpiredError",
  MongoServerError = "MongoServerError",
  DuplicateKey = "MongoError",
}
