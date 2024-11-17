"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_joi_validation_1 = require("express-joi-validation");
const auth_1 = require("../controllers/auth");
const validation_1 = __importDefault(require("../middlewares/validation"));
const auth_2 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
const validator = (0, express_joi_validation_1.createValidator)();
router.post('/login', validator.body(validation_1.default.Login), auth_1.login);
router.post('/register', validator.body(validation_1.default.Register), auth_1.register);
router.post('/logout', auth_2.default, auth_1.logout);
router.get('/me', auth_2.default, auth_1.me);
exports.default = router;
//# sourceMappingURL=auth.route.js.map