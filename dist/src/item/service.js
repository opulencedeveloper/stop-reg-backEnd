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
exports.itemService = void 0;
const entity_1 = __importDefault(require("./entity"));
const mongoose_1 = __importDefault(require("mongoose"));
class ItemService {
    createItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ input, sellerId, buyerId }) {
            const { title, arrivalDate, items } = input;
            const item = new entity_1.default({
                title,
                arrivalDate,
                sellerDetails: sellerId,
                buyerDetails: buyerId,
                items: {
                    parcelItems: items,
                },
            });
            yield item.save();
            return item;
        });
    }
    findParcelBySellerId(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield entity_1.default.find({ sellerDetails: sellerId }).populate({
                path: "buyerDetails",
                select: "-password -emailVerificationOtp -emailVerificationOtpExpiration", // exclude sensitive fields
            });
            return items;
        });
    }
    editParceItemById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { itemId, item } = input;
            const sellerItem = yield entity_1.default.findById(itemId);
            if (!sellerItem)
                return;
            // Find the index of the parcel item to update
            const parcelIndex = sellerItem.items.parcelItems.findIndex((parcel) => { var _a; return ((_a = parcel._id) === null || _a === void 0 ? void 0 : _a.toString()) === item._id; });
            if (parcelIndex === -1)
                return;
            // Apply the updates directly
            sellerItem.items.parcelItems[parcelIndex].name = item.name;
            sellerItem.items.parcelItems[parcelIndex].price = mongoose_1.default.Types.Decimal128.fromString(item.price.toString());
            sellerItem.items.parcelItems[parcelIndex].quantity = item.quantity;
            sellerItem.items.parcelItems[parcelIndex].description = item.description;
            sellerItem.items.parcelItems[parcelIndex].imageUrl = item.imageUrl;
            yield sellerItem.save();
            return sellerItem;
        });
    }
}
exports.itemService = new ItemService();
