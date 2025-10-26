"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const is_auth_1 = require("../middleware/is_auth");
const utils_1 = require("../utils");
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.get("/info", [is_auth_1.isAuth], utils_1.utils.wrapAsync(controller_1.userController.fetchUserDetails));
