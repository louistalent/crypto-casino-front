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
exports.opengame = exports.initGames = exports.betcheck = exports.settledBet = exports.bet = exports.balance = exports.profile = exports.verifyParams = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
exports.verifyParams = (0, catchAsync_1.default)((req, res, next) => {
    services_1.sportsbookService.verifyParams(req, res, next);
});
exports.profile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile, status } = yield services_1.sportsbookService.profile(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
}));
exports.balance = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile, status } = yield services_1.sportsbookService.balance(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
}));
exports.bet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile, status } = yield services_1.sportsbookService.bet(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
}));
exports.settledBet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile, status } = yield services_1.sportsbookService.settledBet(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
}));
exports.betcheck = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile, status } = yield services_1.sportsbookService.betcheck(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
}));
exports.initGames = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const initgames = yield services_1.casinoService.sportsinitGames();
    return res.status(200).json(initgames);
}));
exports.opengame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const initgames = yield services_1.casinoService.opengame(req.user);
    return res.status(200).json(initgames);
}));
//# sourceMappingURL=sportsAPI.js.map