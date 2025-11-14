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
exports.manageDomainService = void 0;
const entity_1 = __importDefault(require("./entity"));
class ManageDomainService {
    addDomain(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = new entity_1.default(Object.assign({}, input));
            const savedManagedDomain = yield domain.save();
            return savedManagedDomain;
        });
    }
    findDomainByNameAndUserId(domain, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({
                _id: userId,
                domain,
            });
            return user;
        });
    }
    deleteDomainByIdAndUserId(domainId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOneAndDelete({
                _id: domainId,
                userId
            });
            return user;
        });
    }
    findDomainsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = yield entity_1.default.find({
                userId,
            });
            return domain;
        });
    }
}
exports.manageDomainService = new ManageDomainService();
