"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardAPI_1 = require("../controllers/dashboardAPI");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/selectCategory', auth_1.default, dashboardAPI_1.selectCategory);
router.post('/setFreeBonus', auth_1.default, dashboardAPI_1.setFreeBonus);
router.get('/getFreeBonus', auth_1.default, dashboardAPI_1.getFreeBonus);
exports.default = router;
//# sourceMappingURL=dashboard.api.js.map