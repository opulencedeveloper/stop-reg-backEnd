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
exports.imageUploadController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const enum_1 = require("../utils/enum");
const cloudnary_1 = __importDefault(require("../../config/cloudnary"));
const utils_1 = require("../utils");
dotenv_1.default.config();
class ImageUploadController {
    constructor() {
        this.MAX_SIZE_KB = 500;
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalBuffer = req.file.buffer;
            const imageUrl = yield this.uploadImageToCloudinary(originalBuffer);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Image uploaded successfully!",
                data: {
                    imageUrl,
                },
            });
        });
    }
    deleteUploadedImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const imageUrl = body.imageUrl;
            const filename = path_1.default.basename(imageUrl);
            const publicId = path_1.default.parse(filename).name; // ✅ get only the name (no extension)
            cloudnary_1.default.uploader.destroy(publicId).catch((err) => {
                console.error(`Failed to delete image ${publicId}:`, err);
            });
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Image deleted successfully!",
                data: null,
            });
        });
    }
    deleteUploadedImages(imageUrls) {
        const publicIds = imageUrls.map((url) => {
            const filename = path_1.default.basename(url); // e.g., "sample.jpg"
            const { name: publicId } = path_1.default.parse(filename); // e.g., "sample"
            return publicId;
        });
        publicIds.forEach((id) => {
            cloudnary_1.default.uploader.destroy(id).catch((err) => {
                console.error(`Failed to delete image ${id}:`, err);
            });
        });
    }
    deleteUploadedImageNotFromReq(imageUrl) {
        const filename = path_1.default.basename(imageUrl);
        const publicId = path_1.default.parse(filename).name; // ✅ get only the name (no extension)
        cloudnary_1.default.uploader.destroy(publicId).catch((err) => {
            console.error(`Failed to delete image ${publicId}:`, err);
        });
    }
    uploadImageToCloudinary(originalBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxSizeKB = this.MAX_SIZE_KB;
            let finalBuffer;
            let tempFileName = "";
            const isGreaterThanMaxSizeKB = originalBuffer.length > maxSizeKB * 1024;
            try {
                finalBuffer = isGreaterThanMaxSizeKB
                    ? yield this.compressImageToLimit(originalBuffer, maxSizeKB)
                    : originalBuffer;
                tempFileName = path_1.default.join(os_1.default.tmpdir(), `${(0, uuid_1.v4)()}.jpg`);
                yield promises_1.default.writeFile(tempFileName, finalBuffer); // ✅ Needed!
                const profileImageUpload = yield cloudnary_1.default.uploader.upload(tempFileName);
                return profileImageUpload.secure_url;
            }
            catch (error) {
                throw error;
            }
            finally {
                if (tempFileName) {
                    promises_1.default.unlink(tempFileName).catch((err) => {
                        console.error(`Failed to delete temp file ${tempFileName}:`, err);
                    });
                }
            }
        });
    }
    compressImageToLimit(originalBuffer_1) {
        return __awaiter(this, arguments, void 0, function* (originalBuffer, maxSizeKB = 500) {
            let quality = 80;
            let compressedBuffer = yield (0, sharp_1.default)(originalBuffer)
                .resize({ width: 800 })
                .jpeg({ quality })
                .toBuffer();
            while (compressedBuffer.length > maxSizeKB * 1024 && quality > 10) {
                quality -= 10;
                compressedBuffer = yield (0, sharp_1.default)(originalBuffer)
                    .resize({ width: 800 })
                    .jpeg({ quality })
                    .toBuffer();
            }
            return compressedBuffer;
        });
    }
}
exports.imageUploadController = new ImageUploadController();
