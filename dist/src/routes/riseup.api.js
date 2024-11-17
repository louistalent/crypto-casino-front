"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const riseupAPI_1 = require("../controllers/riseupAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/initgames', riseupAPI_1.initgames);
router.post('/opengame', auth_1.default, riseupAPI_1.openGame);
router.post('/callback/GetBalance', riseupAPI_1.getBalance);
router.post('/callback/SetPlay', riseupAPI_1.setPlay);
exports.default = router;
//# sourceMappingURL=riseup.api.js.map