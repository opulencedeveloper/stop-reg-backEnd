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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("../user/service");
const utils_1 = require("../utils");
const service_2 = require("./service");
const enum_2 = require("./enum");
class TransactionController {
    initializeDepositWithMonify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const user = yield service_1.userService.findUserById(userId);
            if (!user) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User does not exist!",
                    data: null,
                });
            }
            const depositAmount = parseFloat(body.amount.toFixed(2));
            const initialiseTopUp = yield service_2.transactionService.initializeMonnifyTransaction({
                amount: depositAmount,
                senderEmail: user.email,
                senderFirstName: user.firstName,
                senderLastName: user.lastName,
                transactionId: utils_1.utils.generateTransactionId(),
            });
            if (!initialiseTopUp) {
                return utils_1.utils.customResponse({
                    res,
                    status: 400,
                    message: enum_1.MessageResponse.Error,
                    description: "Error occurred: unable to initialize top up",
                    data: null,
                });
            }
            yield service_2.transactionService.createDeposit({
                amount: depositAmount,
                receiverWalletBalanceBefore: user.walletBalance,
                senderWalletBalanceBefore: user.walletBalance,
                transactionChannel: enum_2.TransactionChannel.MONNIFY,
                transactionId: initialiseTopUp.paymentReference,
                transactionRefId: initialiseTopUp.transactionReference,
                userId: user._id,
            });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Payment url generated successfully!",
                data: {
                    paymentUrl: initialiseTopUp.checkoutUrl,
                },
            });
        });
    }
    monnifyWebhookUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = JSON.stringify(req.body);
            const signature = req.header("monnify-signature");
            if (!service_2.transactionService.verifyMonnifyWebhookSignature(requestBody, signature)) {
                return utils_1.utils.customResponse({
                    res,
                    status: 400,
                    message: enum_1.MessageResponse.Error,
                    description: "Invalid hook signature",
                    data: null,
                });
            }
            // Signature is valid, process the webhook payload.
            const eventData = req.body.eventData;
            const transactionReference = eventData.transactionReference;
            const amount = eventData.amountPaid;
            // Check to see if you've processed this webhook before using the reference to prevent double credit
            const isDuplicate = yield service_2.transactionService.checkyMonnifyDuplicateTransaction(transactionReference);
            if (isDuplicate) {
                console.log("Duplicate transaction found");
                return utils_1.utils.customResponse({
                    res,
                    status: 400,
                    message: enum_1.MessageResponse.Error,
                    description: "Duplicate transaction found",
                    data: { reference: transactionReference, amount: amount },
                });
            }
            //check if payment was successfull
            if (eventData.paymentStatus !== "PAID") {
                return utils_1.utils.customResponse({
                    res,
                    status: 400,
                    message: enum_1.MessageResponse.Error,
                    description: "Transaction failed",
                    data: { reference: transactionReference, amount: amount },
                });
            }
            const verifyTopUp = yield service_2.transactionService.verifyTopUpWalletWithMonnify(eventData.transactionReference);
            if (!verifyTopUp) {
                return utils_1.utils.customResponse({
                    res,
                    status: 404,
                    message: enum_1.MessageResponse.Error,
                    description: "Transaction not found",
                    data: null,
                });
            }
            if (typeof verifyTopUp === "string") {
                return utils_1.utils.customResponse({
                    res,
                    status: 404,
                    message: enum_1.MessageResponse.Error,
                    description: verifyTopUp,
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                res,
                status: 201,
                message: enum_1.MessageResponse.Success,
                description: "Transaction successful and wallet credited",
                data: {
                    transactionId: verifyTopUp.transactionId,
                    sataus: verifyTopUp.status,
                    reference: verifyTopUp.transactionRefId,
                    amount: verifyTopUp.amount,
                },
            });
        });
    }
}
exports.transactionController = new TransactionController();
