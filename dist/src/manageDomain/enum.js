"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageDomainType = exports.ManageDomainStatus = void 0;
var ManageDomainStatus;
(function (ManageDomainStatus) {
    ManageDomainStatus["ACTIVE"] = "active";
    ManageDomainStatus["INACTIVE"] = "inactive";
})(ManageDomainStatus || (exports.ManageDomainStatus = ManageDomainStatus = {}));
var ManageDomainType;
(function (ManageDomainType) {
    ManageDomainType["BLOCKED"] = "blocked";
    ManageDomainType["ALLOWED"] = "allowed";
    ManageDomainType["REPORTED"] = "reported";
})(ManageDomainType || (exports.ManageDomainType = ManageDomainType = {}));
