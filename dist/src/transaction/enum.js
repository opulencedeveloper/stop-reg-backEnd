"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.TransactionChannel = exports.TransactionStatus = void 0;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "success";
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionChannel;
(function (TransactionChannel) {
    TransactionChannel["MONNIFY"] = "monnify";
})(TransactionChannel || (exports.TransactionChannel = TransactionChannel = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
