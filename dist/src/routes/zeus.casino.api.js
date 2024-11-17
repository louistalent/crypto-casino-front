"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zeusCasino_1 = require("../controllers/zeusCasino");
const casinoAPI_1 = require("../controllers/casinoAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/initgames', zeusCasino_1.initgames);
router.post('/list', zeusCasino_1.gamelist);
router.post('/liveCasinolist', zeusCasino_1.livegamelist);
router.post('/virtualgamelist', zeusCasino_1.virtualgamelist);
router.post('/providergame', zeusCasino_1.providerGameList);
router.post('/getGame', auth_1.default, zeusCasino_1.gamePlay);
router.post('/searchgame', zeusCasino_1.searchGame);
router.get('/callback/get', casinoAPI_1.callbackget);
router.get('/callback/post', casinoAPI_1.callbackpost);
exports.default = router;
//# sourceMappingURL=zeus.casino.api.js.map