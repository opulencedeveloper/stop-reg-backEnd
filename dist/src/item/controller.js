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
exports.itemController = void 0;
const enum_1 = require("../utils/enum");
const service_1 = require("../user/service");
const utils_1 = require("../utils");
const service_2 = require("./service");
const mongoose_1 = __importDefault(require("mongoose"));
class ItemController {
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId: sellerId } = req;
            const buyerExist = yield service_1.userService.findUserByUserName(body.buyerUserName);
            if (!buyerExist) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Buyer does not exist!",
                    data: null,
                });
            }
            yield service_2.itemService.createItem({
                input: body,
                buyerId: buyerExist._id,
                sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
            });
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Item created succeddfully!",
                data: null,
            });
        });
    }
    editSellerItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const editedItem = yield service_2.itemService.editParceItemById(body);
            if (!editedItem) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Item does not exist!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Item edited successfully!",
                data: null,
            });
        });
    }
}
exports.itemController = new ItemController();
