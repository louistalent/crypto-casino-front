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
exports.deposit = exports.withdraw = exports.getBalance = exports.Authenticate = exports.openGame = exports.initgames = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
exports.initgames = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.multigamesService.initGames();
    res.send(result);
}));
exports.openGame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.multigamesService.openGame(req.body, req.user);
    res.send(gamePlay);
}));
exports.Authenticate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.multigamesService.Authenticate(req.body);
    res.send(gamePlay);
}));
exports.getBalance = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.multigamesService.getBalance(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
}));
exports.withdraw = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.multigamesService.withdraw(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
}));
exports.deposit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.multigamesService.deposit(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
}));
//# sourceMappingURL=multigamesAPI.js.map