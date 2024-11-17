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
exports.callbackpost = exports.callbackget = exports.searchGame = exports.gamePlay = exports.providerGameList = exports.virtualgamelist = exports.livegamelist = exports.gamelist = exports.initgames = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
const initgames = () => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.zeusCasinoService.initGames();
});
exports.initgames = initgames;
exports.gamelist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.zeusCasinoService.gamelist();
    res.send(gameList);
}));
exports.livegamelist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.zeusCasinoService.livegamelist();
    res.send(gameList);
}));
exports.virtualgamelist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.zeusCasinoService.virtualgamelist();
    res.send(gameList);
}));
exports.providerGameList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.zeusCasinoService.providerGameList(req.body);
    res.send(gameList);
}));
exports.gamePlay = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.zeusCasinoService.openGame(req.body, req.user);
    res.send(gamePlay);
}));
exports.searchGame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.zeusCasinoService.searchGame(req.body);
    res.send(result);
}));
exports.callbackget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callback = yield services_1.zeusCasinoService.callbackget(req.query);
    res.send(callback);
}));
exports.callbackpost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callback = yield services_1.zeusCasinoService.callbackpost(req.query);
    res.send(callback);
}));
//# sourceMappingURL=zeusCasino.js.map