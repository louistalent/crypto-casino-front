"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sportsAPI_1 = require("../controllers/sportsAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.post('/user/profile', sportsAPI_1.verifyParams, sportsAPI_1.profile);
router.post('/user/balance', sportsAPI_1.verifyParams, sportsAPI_1.balance);
router.post('/payment/bet', sportsAPI_1.verifyParams, sportsAPI_1.bet);
router.put('/payment/bet', sportsAPI_1.verifyParams, sportsAPI_1.settledBet);
router.post('/payment/check', sportsAPI_1.verifyParams, sportsAPI_1.betcheck);
router.get('/initgames', sportsAPI_1.initGames);
router.get('/open', auth_1.default, sportsAPI_1.opengame);
exports.default = router;
//# sourceMappingURL=sportsbook.api.js.map