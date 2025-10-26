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
exports.parcelService = void 0;
const controller_1 = require("../imageUpload/controller");
const entity_1 = __importDefault(require("./entity"));
const enum_1 = require("./enum");
const mongoose_1 = __importDefault(require("mongoose"));
class ParcelService {
    createParcel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sellerParcelInput, sellerId, buyerId, }) {
            const { title, arrivalDate, parcelItems } = sellerParcelInput;
            const parcel = new entity_1.default({
                title,
                arrivalDate,
                sellerDetails: sellerId,
                buyerDetails: buyerId,
                items: {
                    parcelItems,
                },
            });
            yield parcel.save();
            return parcel;
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
    findParcelByBuyerId(buyerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield entity_1.default.find({ buyerDetails: buyerId }).populate({
                path: "sellerDetails",
                select: "-password -emailVerificationOtp -emailVerificationOtpExpiration", // exclude sensitive fields
            });
            return items;
        });
    }
    editParceByIdAndSellerId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { arrivalDate, buyerId, parcelId, title, sellerId } = input;
            const parcel = yield entity_1.default.findOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            if (parcel) {
                if (parcel.status != enum_1.ItemStatus.PENDING) {
                    return 400;
                }
                parcel.title = title;
                parcel.arrivalDate = arrivalDate;
                parcel.buyerDetails = buyerId;
                yield parcel.save();
            }
            return parcel;
        });
    }
    editParceItemByIdAndSellerId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId, parcelItem, sellerId } = input;
            const parcel = yield entity_1.default.findOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            if (!parcel)
                return;
            if (parcel.status != enum_1.ItemStatus.PENDING) {
                return 400;
            }
            // Find the index of the parcel item to update
            const parcelIndex = parcel.items.parcelItems.findIndex((parcel) => { var _a, _b; return ((_a = parcel._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = parcelItem._id) === null || _b === void 0 ? void 0 : _b.toString()); });
            if (parcelIndex === -1)
                return;
            let imageUrl = parcelItem.imageUrl;
            if (parcelItem === null || parcelItem === void 0 ? void 0 : parcelItem.imageFile) {
                const originalBuffer = parcelItem.imageFile.buffer;
                const uploadedImageUrl = yield controller_1.imageUploadController.uploadImageToCloudinary(originalBuffer);
                controller_1.imageUploadController.deleteUploadedImageNotFromReq(imageUrl);
                imageUrl = uploadedImageUrl;
            }
            // Apply the updates directly
            parcel.items.parcelItems[parcelIndex].name = parcelItem.name;
            parcel.items.parcelItems[parcelIndex].price =
                mongoose_1.default.Types.Decimal128.fromString(parcelItem.price.toString());
            parcel.items.parcelItems[parcelIndex].quantity = parcelItem.quantity;
            parcel.items.parcelItems[parcelIndex].description = parcelItem.description;
            parcel.items.parcelItems[parcelIndex].imageUrl = imageUrl;
            yield parcel.save();
            return parcel;
        });
    }
    addParceItemByIdAndSellerId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId, sellerId, description, imageUrl, name, price, quantity } = input;
            const parcel = yield entity_1.default.findOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            if (!parcel)
                return;
            if (parcel.status != enum_1.ItemStatus.PENDING) {
                return 400;
            }
            const convertedPrice = mongoose_1.default.Types.Decimal128.fromString(price.toString());
            parcel.items.parcelItems.push({
                name,
                description,
                imageUrl,
                price: convertedPrice,
                quantity
            });
            yield parcel.save();
            return parcel;
        });
    }
    deleteParceByIdAndSellerId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId, sellerId } = input;
            const parcel = yield entity_1.default.findOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            if (!parcel) {
                return;
            }
            if (parcel.status !== enum_1.ItemStatus.PENDING) {
                return 400;
            }
            const imageUrls = parcel.items.parcelItems.map((item) => item.imageUrl);
            controller_1.imageUploadController.deleteUploadedImages(imageUrls);
            const deletedParcel = yield entity_1.default.deleteOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            return deletedParcel;
        });
    }
    deleteParcelItemByIdAndSellerId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId, parcelItemId, sellerId } = input;
            const parcel = yield entity_1.default.findOne({
                _id: parcelId,
                sellerDetails: sellerId,
            });
            if (!parcel)
                return;
            if (parcel.status != enum_1.ItemStatus.PENDING) {
                return 400;
            }
            if (parcel.items.parcelItems.length === 1) {
                return 444;
            }
            const parcelIndex = parcel.items.parcelItems.findIndex((parcel) => { var _a, _b; return ((_a = parcel._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = parcelItemId._id) === null || _b === void 0 ? void 0 : _b.toString()); });
            if (parcelIndex === -1)
                return;
            // Remove the item from the array
            const [deletedItem] = parcel.items.parcelItems.splice(parcelIndex, 1);
            controller_1.imageUploadController.deleteUploadedImageNotFromReq(deletedItem.imageUrl);
            yield parcel.save();
            return parcel;
        });
    }
    acceptParcel(parcelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedParcel = yield entity_1.default.findOneAndUpdate({ _id: parcelId, status: enum_1.ItemStatus.PENDING }, // only match if pending
            { status: enum_1.ItemStatus.IN_PROGRESS }, { new: true });
            return updatedParcel;
        });
    }
    declineParcel(parcelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedParcel = yield entity_1.default.findOneAndUpdate({ _id: parcelId, status: enum_1.ItemStatus.PENDING }, // only match if pending
            { status: enum_1.ItemStatus.DECLINED }, { new: true });
            return updatedParcel;
        });
    }
}
exports.parcelService = new ParcelService();
