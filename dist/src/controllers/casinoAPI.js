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
exports.eachgameget = exports.searchGame = exports.categoryProviderChange = exports.isReadMessage = exports.getmessage = exports.getJackpot = exports.gamehistory = exports.callbackpost = exports.callbackget = exports.openGame = exports.allgameget = exports.gamelist = exports.provider = exports.initgames = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
exports.initgames = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield services_1.casinoService.initGames();
    res.send('ok');
}));
exports.provider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.casinoService.provider(req.body);
    res.send(gameList);
}));
exports.gamelist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.casinoService.gamelist(req.body);
    res.send(gameList);
}));
exports.allgameget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameList = yield services_1.casinoService.allgameget(req.body);
    res.send(gameList);
}));
exports.openGame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamePlay = yield services_1.casinoService.openGame(req.body, req.user);
    res.send(gamePlay);
}));
exports.callbackget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callback = yield services_1.casinoService.callbackget(req.query);
    res.send(callback);
}));
exports.callbackpost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const callback = yield services_1.casinoService.callbackpost(req.query);
    res.send(callback);
}));
exports.gamehistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gamehistory = yield services_1.casinoService.gamehistory(req.user);
    res.send(gamehistory);
}));
exports.getJackpot = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jackpot = yield services_1.casinoService.getJackpot();
    res.send(jackpot);
}));
exports.getmessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jackpot = yield services_1.casinoService.getmessage(req.user);
    res.send(jackpot);
}));
exports.isReadMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jackpot = yield services_1.casinoService.isReadMessage(req.user);
    res.send(jackpot);
}));
exports.categoryProviderChange = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jackpot = yield services_1.casinoService.categoryProviderChange();
    res.send(jackpot);
}));
exports.searchGame = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.casinoService.searchGame(req.body);
    res.send(result);
}));
exports.eachgameget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_1.casinoService.eachgameget(req.body);
    res.send(result);
}));
// export const livegamelist = catchAsync(async (req, res: Response) => {
//     const gameList = await casinoService.livegamelist();
//     res.send(gameList);
// });
// export const virtualgamelist = catchAsync(async (req, res: Response) => {
//     const gameList = await casinoService.virtualgamelist();
//     res.send(gameList);
// });
// export const callback = catchAsync(async (req: AuthRequest, res: Response) => {
//     const callback = await casinoService.callback(req.body);
//     res.send(callback);
// });
//# sourceMappingURL=casinoAPI.js.map