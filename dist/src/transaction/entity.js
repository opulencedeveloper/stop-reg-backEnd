"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("./enum");
const enum_2 = require("../parcel/enum");
const transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
    },
    transactionRefId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(enum_1.TransactionStatus),
        default: enum_2.ItemStatus.PENDING,
    },
    senderDetails: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiverDetails: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    transactionChannel: {
        type: String,
        enum: Object.values(enum_1.TransactionChannel),
        required: true,
    },
    transactionType: {
        type: String,
        enum: Object.values(enum_1.TransactionType),
        required: true,
    },
    amount: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        get: (v) => v ? parseFloat(v.toString()) : 0,
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    senderWalletBalanceBefore: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        get: (v) => v ? parseFloat(v.toString()) : 0,
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
    receiverWalletBalanceBefore: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        min: mongoose_1.default.Types.Decimal128.fromString("0.00"),
        get: (v) => v ? parseFloat(v.toString()) : 0,
        set: (v) => mongoose_1.default.Types.Decimal128.fromString(v.toString()),
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
