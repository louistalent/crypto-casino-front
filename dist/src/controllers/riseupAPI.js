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
exports.setPlay = exports.getBalance = exports.openGame = exports.initgames = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
exports.initgames = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.riseupCasinoService.initGames();
    res.send(result);
}));
exports.openGame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.riseupCasinoService.openGame(req.body, req.user);
    res.send(gamePlay);
}));
exports.getBalance = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.riseupCasinoService.getBalance(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
}));
exports.setPlay = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.riseupCasinoService.setPlay(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
}));
//# sourceMappingURL=riseupAPI.js.map