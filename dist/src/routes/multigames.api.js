"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multigamesAPI_1 = require("../controllers/multigamesAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/initgames', multigamesAPI_1.initgames);
router.post('/opengame', auth_1.default, multigamesAPI_1.openGame);
router.post('/callback/Authenticate', multigamesAPI_1.Authenticate);
router.post('/callback/GetBalance', multigamesAPI_1.getBalance);
router.post('/callback/Withdraw', multigamesAPI_1.withdraw);
router.post('/callback/Deposit', multigamesAPI_1.deposit);
exports.default = router;
//# sourceMappingURL=multigames.api.js.map