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
exports.manageDomainController = void 0;
const enum_1 = require("../utils/enum");
const utils_1 = require("../utils");
const service_1 = require("./service");
const service_2 = require("../user/service");
class ManageDomainController {
    addDomain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_2.userService.findUserById(userId);
            if (!userExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "User not found!",
                    data: null,
                });
            }
            const domainExists = yield service_1.manageDomainService.findDomainByName(body.domain);
            if (domainExists) {
                return utils_1.utils.customResponse({
                    status: 404,
                    res,
                    message: enum_1.MessageResponse.Error,
                    description: "Domain already exist!",
                    data: null,
                });
            }
            const savedManagedDomain = yield service_1.manageDomainService.addDomain(Object.assign(Object.assign({}, body), { userId: userExists._id }));
            return utils_1.utils.customResponse({
                status: 201,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Domain added successfully!",
                data: { savedManagedDomain },
            });
        });
    }
    fetchUserDomains(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const manageDomains = yield service_1.manageDomainService.findDomainsByUserId(userId);
            return utils_1.utils.customResponse({
                status: 200,
                res,
                message: enum_1.MessageResponse.Success,
                description: "Domains fetched successfully!",
                data: manageDomains,
            });
        });
    }
}
exports.manageDomainController = new ManageDomainController();
