"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const casinoAPI_1 = require("../controllers/casinoAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/initgames', casinoAPI_1.initgames);
router.post('/provider', casinoAPI_1.provider);
router.post('/gamelist', casinoAPI_1.gamelist);
router.post('/allgameget', casinoAPI_1.allgameget);
router.post('/opengame', auth_1.default, casinoAPI_1.openGame);
router.post('/history', auth_1.default, casinoAPI_1.gamehistory);
router.get('/getJackpot', casinoAPI_1.getJackpot);
router.get('/getMessage', auth_1.default, casinoAPI_1.getmessage);
router.post('/isReadMessage', auth_1.default, casinoAPI_1.isReadMessage);
router.post('/category_provider_change', casinoAPI_1.categoryProviderChange);
router.post('/searchgame', casinoAPI_1.searchGame);
router.post('/eachgameget', casinoAPI_1.eachgameget);
// router.post('/liveCasinolist', livegamelist);
// router.post('/virtualgamelist', virtualgamelist);
// router.post('/callback', callback);
exports.default = router;
//# sourceMappingURL=casino.api.js.map