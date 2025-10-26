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
exports.parcelController = void 0;
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const service_1 = require("./service");
const controller_1 = require("../imageUpload/controller");
class ParcelController {
    createParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId: sellerId, buyerId } = req;
            yield service_1.parcelService.createParcel({
                sellerParcelInput: body,
                buyerId: buyerId,
                sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
            });
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel created succeddfully!",
                data: null,
            });
        });
    }
    editParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { buyerId, userId: sellerId } = req;
            const parcel = yield service_1.parcelService.editParceByIdAndSellerId({
                arrivalDate: body.arrivalDate,
                buyerId: buyerId,
                title: body.title,
                parcelId: body.parcelId,
                sellerId: sellerId,
            });
            if (parcel === 400) {
                return utils_1.utils.customResponse({
                    status: parcel,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can only edit a pending parcel!",
                    data: parcel,
                });
            }
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel edited successfully!",
                data: parcel,
            });
        });
    }
    editParcelItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId: sellerId } = req;
            const parcel = yield service_1.parcelService.editParceItemByIdAndSellerId(Object.assign(Object.assign({}, body), { parcelItem: Object.assign(Object.assign({}, body), { _id: body.parcelItemId, imageFile: req.file }), sellerId: sellerId }));
            if (parcel === 400) {
                return utils_1.utils.customResponse({
                    status: parcel,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can only edit a pending parcel!",
                    data: parcel,
                });
            }
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Parcel or Parcel Item does not exist!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel Item edited successfully!",
                data: null,
            });
        });
    }
    addParcelItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId: sellerId } = req;
            let imageUrl;
            const file = req.file;
            const originalBuffer = file.buffer;
            const uploadedImageUrl = yield controller_1.imageUploadController.uploadImageToCloudinary(originalBuffer);
            imageUrl = uploadedImageUrl;
            const parcel = yield service_1.parcelService.addParceItemByIdAndSellerId(Object.assign(Object.assign({}, body), { imageUrl: imageUrl, sellerId: sellerId }));
            if (parcel === 400) {
                return utils_1.utils.customResponse({
                    status: parcel,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can only edit a pending parcel!",
                    data: parcel,
                });
            }
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Parcel or Parcel Item does not exist!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel Item added successfully!",
                data: null,
            });
        });
    }
    deleteParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId } = req.query;
            const { userId: sellerId } = req;
            const parcel = yield service_1.parcelService.deleteParceByIdAndSellerId({
                parcelId: new mongoose_1.default.Types.ObjectId(parcelId === null || parcelId === void 0 ? void 0 : parcelId.toString()),
                sellerId: sellerId,
            });
            if (parcel === 400) {
                return utils_1.utils.customResponse({
                    status: parcel,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can only delete a pending parcel!",
                    data: parcel,
                });
            }
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Parcel does not exist!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel deleted successfully!",
                data: null,
            });
        });
    }
    deleteParcelItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId, parcelItemId } = req.query;
            const { userId: sellerId } = req;
            const parcel = yield service_1.parcelService.deleteParcelItemByIdAndSellerId({
                parcelId: new mongoose_1.default.Types.ObjectId(parcelId === null || parcelId === void 0 ? void 0 : parcelId.toString()),
                parcelItemId: new mongoose_1.default.Types.ObjectId(parcelItemId === null || parcelItemId === void 0 ? void 0 : parcelItemId.toString()),
                sellerId: sellerId,
            });
            if (parcel === 400) {
                return utils_1.utils.customResponse({
                    status: parcel,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can only delete a pending parcel!",
                    data: parcel,
                });
            }
            if (parcel === 444) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "You can not delete every item in this waybill!",
                    data: parcel,
                });
            }
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Parcel Item does not exist!",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel Item deleted successfully!",
                data: null,
            });
        });
    }
    acceptParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId } = req.query;
            const parcel = yield service_1.parcelService.acceptParcel(parcelId);
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Success,
                    description: "Only pending parcels can be accepted",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel is being processed!",
                data: null,
            });
        });
    }
    declineParcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parcelId } = req.query;
            const parcel = yield service_1.parcelService.declineParcel(parcelId);
            if (!parcel) {
                return utils_1.utils.customResponse({
                    status: 400,
                    res,
                    message: enum_1.MessageResponse.Success,
                    description: "Only pending parcels can be declined",
                    data: null,
                });
            }
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Parcel declined successfully!",
                data: null,
            });
        });
    }
}
exports.parcelController = new ParcelController();
