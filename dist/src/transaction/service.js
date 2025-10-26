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
exports.transactionService = void 0;
const axios_1 = __importDefault(require("axios"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const entity_1 = __importDefault(require("./entity"));
const enum_1 = require("./enum");
const crypto_1 = __importDefault(require("crypto"));
const entity_2 = __importDefault(require("../user/entity"));
const mongoose_1 = __importDefault(require("mongoose"));
class TransactionService {
    getMonifyBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = process.env.MONNIFY_BASEURL;
            const apiKey = process.env.MONNIFY_API_KEY;
            const secretKey = process.env.MONNIFY_SECRET;
            const encodedAuth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");
            const loginResponse = yield axios_1.default.post(`${baseUrl}/api/v1/auth/login`, {}, {
                headers: {
                    Authorization: `Basic ${encodedAuth}`,
                    "Content-Type": "application/json",
                },
            });
            return loginResponse;
        });
    }
    initializeMonnifyTransaction(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { amount, senderEmail, senderFirstName, senderLastName, transactionId, } = input;
            const baseUrl = process.env.MONNIFY_BASEURL;
            const apiKey = process.env.MONNIFY_API_KEY;
            const secretKey = process.env.MONNIFY_SECRET;
            const contractCode = process.env.MONNIFY_CONTRACT_CODE;
            const redirectUrl = process.env.MONNIFY_REDIRECT_URL;
            if (!baseUrl || !apiKey || !secretKey || !contractCode || !redirectUrl) {
                console.error("Missing Monnify environment variables");
                return;
            }
            const loginResponse = yield this.getMonifyBearerToken();
            // await axios.post(
            //   `${baseUrl}/api/v1/auth/login`,
            //   {},
            //   {
            //     headers: {
            //       Authorization: `Basic ${encodedAuth}`,
            //       "Content-Type": "application/json",
            //     },
            //   }
            // );
            if (!((_b = (_a = loginResponse.data) === null || _a === void 0 ? void 0 : _a.responseBody) === null || _b === void 0 ? void 0 : _b.accessToken)) {
                console.error("Failed to retrieve Monnify access token");
                return;
            }
            const accessToken = loginResponse.data.responseBody.accessToken;
            const payload = {
                amount: amount,
                customerName: `${senderFirstName} ${senderLastName}`,
                customerEmail: senderEmail,
                paymentReference: transactionId,
                paymentDescription: "Secured Deal Wallet Topup Transaction",
                currencyCode: "NGN",
                contractCode: contractCode,
                redirectUrl: `${redirectUrl}?payment=success`,
                paymentMethods: ["CARD", "ACCOUNT_TRANSFER", "USSD"],
            };
            const response = yield axios_1.default.post(`${baseUrl}/api/v1/merchant/transactions/init-transaction`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!(response === null || response === void 0 ? void 0 : response.data)) {
                console.error("No response from Monnify");
                return;
            }
            if (response.data.requestSuccessful === false) {
                console.error(response.data.responseMessage || "Failed to initialize transaction");
                return;
            }
            const result = response.data.responseBody;
            return {
                checkoutUrl: result.checkoutUrl,
                paymentReference: result.paymentReference,
                transactionReference: result.transactionReference,
                amount: result.amount,
            };
        });
    }
    verifyMonnifyWebhookSignature(requestBody, signature) {
        const secretKey = process.env.MONNIFY_SECRET || "";
        const computedHash = crypto_1.default.createHmac("sha512", secretKey)
            .update(requestBody)
            .digest("hex");
        return computedHash === signature;
    }
    checkyMonnifyDuplicateTransaction(transactionRefId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield entity_1.default.findOne({
                transactionRefId,
                status: enum_1.TransactionStatus.SUCCESS,
            });
            return transaction;
        });
    }
    verifyTopUpWalletWithMonnify(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const baseUrl = process.env.MONNIFY_BASEURL;
            const encodedTransRef = encodeURI(ref);
            const url = `${baseUrl}/api/v2/transactions/${encodedTransRef}`;
            const loginResponse = yield this.getMonifyBearerToken();
            if (!((_b = (_a = loginResponse.data) === null || _a === void 0 ? void 0 : _a.responseBody) === null || _b === void 0 ? void 0 : _b.accessToken)) {
                console.error("Failed to retrieve Monnify access token", loginResponse);
                return "Failed to retrieve Monnify access token";
            }
            const accessToken = loginResponse.data.responseBody.accessToken;
            const verify = yield axios_1.default.get(url, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!(verify === null || verify === void 0 ? void 0 : verify.data) || verify.data.responseBody.paymentStatus !== "PAID") {
                console.error("Error verifying topup: transaction failed", verify === null || verify === void 0 ? void 0 : verify.data);
                return "Error verifying topup: transaction failed";
            }
            const transaction = yield entity_1.default.findOne({
                transactionRefId: ref,
                status: enum_1.TransactionStatus.PENDING,
            }, {
                $set: { status: enum_1.TransactionStatus.SUCCESS },
            }, { new: true });
            if (!transaction) {
                console.error("Trans not found");
                return "Transaction not found";
            }
            const user = yield entity_2.default.findById(transaction.receiverDetails);
            if (!user) {
                console.error("User not found!");
                return "User not found";
            }
            const currentBalance = new decimal_js_1.default(user.walletBalance.toString());
            const amountToAdd = new decimal_js_1.default(transaction.amount.toString());
            const newBalance = currentBalance.plus(amountToAdd);
            user.walletBalance = mongoose_1.default.Types.Decimal128.fromString(newBalance.toFixed(2));
            user.walletBalance = mongoose_1.default.Types.Decimal128.fromString(newBalance.toFixed(2));
            yield user.save();
            return transaction;
        });
    }
    createDeposit(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, receiverWalletBalanceBefore, senderWalletBalanceBefore, transactionChannel, transactionId, transactionRefId, userId, } = input;
            const transaction = new entity_1.default({
                transactionId,
                senderDetails: userId,
                receiverDetails: userId,
                transactionChannel,
                transactionType: enum_1.TransactionType.DEPOSIT,
                amount: amount,
                transactionRefId,
                senderWalletBalanceBefore,
                receiverWalletBalanceBefore,
            });
            yield transaction.save();
            return;
        });
    }
}
exports.transactionService = new TransactionService();
