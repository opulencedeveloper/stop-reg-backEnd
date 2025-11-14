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
exports.emailDomainService = void 0;
const entity_1 = __importDefault(require("./entity"));
const utils_1 = require("../utils");
class EmailDomainService {
    addEmailDomain(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = new entity_1.default(Object.assign({}, input));
            const savedEmailDomain = yield domain.save();
            return savedEmailDomain;
        });
    }
    checkIfDomainExist(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailDomain = new entity_1.default({
                domain
            });
            return emailDomain;
        });
    }
    checkDisposableEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = email.split("@")[1].toLowerCase();
            const disposableEmail = yield entity_1.default.findOne({ domain }).select("-bot_username -bot_password");
            return disposableEmail;
        });
    }
    verifyBulkDomains(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanedDomains = domains.map(utils_1.utils.normalizeDomain);
            const results = yield entity_1.default.find({
                domain: { $in: cleanedDomains },
            });
            return results;
        });
    }
    ;
}
exports.emailDomainService = new EmailDomainService();
