"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pragmaticAPI_1 = require("../controllers/pragmaticAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/initgames', pragmaticAPI_1.initgames);
router.post('/opengame', auth_1.default, pragmaticAPI_1.openGame);
router.post('/callback/GetBalance', pragmaticAPI_1.getBalance);
router.post('/callback/BetWin', pragmaticAPI_1.betWin);
router.post('/callback/Withdraw', pragmaticAPI_1.withdraw);
router.post('/callback/Deposit', pragmaticAPI_1.deposit);
router.post('/callback/RollbackTransaction', pragmaticAPI_1.rollback);
exports.default = router;
//# sourceMappingURL=riseup.pragmatic.api.js.map