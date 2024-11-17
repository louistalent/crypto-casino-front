"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_joi_validation_1 = require("express-joi-validation");
const user_1 = require("../controllers/user");
const validation_1 = __importDefault(require("../middlewares/validation"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const upload_1 = require("../middlewares/upload");
// import { uploadValdiation } from '../middlewares/uploadValidation';
const router = express_1.default.Router();
const validator = (0, express_joi_validation_1.createValidator)();
router.route('/').get(auth_1.default, user_1.getAllUsers);
router.route('/').post(auth_1.default, upload_1.uploadAvatar, 
// uploadValdiation(VSchema.createUser, 'avatar/'),
validator.body(validation_1.default.createUser), user_1.createUser);
router.route('/remove').post(auth_1.default, validator.body(validation_1.default.remove), user_1.deleteUsers);
router
    .route('/:userId')
    .get(auth_1.default, validator.params(validation_1.default.userId), user_1.getUser)
    .put(auth_1.default, upload_1.uploadAvatar, 
// uploadValdiation(VSchema.updateUser, 'avatar/'),
// validator.params(VSchema.userId),
// validator.body(VSchema.updateUser),
user_1.updateUser)
    .delete(auth_1.default, validator.params(validation_1.default.userId), user_1.deleteUser);
// get Transactions
router.post('/getTransaction', auth_1.default, user_1.getTransactions);
exports.default = router;
//# sourceMappingURL=user.route.js.map