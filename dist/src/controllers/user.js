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
exports.getTransactions = exports.updateUser = exports.deleteUsers = exports.deleteUser = exports.getUser = exports.getAllUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const services_1 = require("../services");
exports.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.createUser(req.body, req);
    res.status(http_status_1.default.CREATED).send({ user });
}));
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.userService.getAllUsers();
    res.send(result);
}));
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.getUserById(req.user);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    res.send(user);
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.userService.deleteUserById(req.user);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.deleteUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const failedUserIds = yield services_1.userService.deleteUsersById(req.body.ids);
    res.status(http_status_1.default.OK).send(failedUserIds);
}));
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.updateUserById(req.user._id, req.body);
    return res.send({ user });
}));
exports.getTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getTransaction = yield services_1.userService.getTransactions(req.user);
    return res.send(getTransaction);
}));
//# sourceMappingURL=user.js.map