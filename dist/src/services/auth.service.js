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
const http_status_1 = __importDefault(require("http-status"));
// import tokenService from './token.service';
// import Token from '../models/token.model';
const user_service_1 = __importDefault(require("./user.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const token_service_1 = __importDefault(require("./token.service"));
/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = yield user_service_1.default.getUserByEmail(email);
    const user = yield user_service_1.default.getUserByUsername(email);
    if (!userEmail && !user) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email');
    }
    else if (!userEmail && user) {
        if (user.roleId !== 'user') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid User');
        }
        else {
            return user;
        }
    }
    else {
        if (user.roleId !== 'user') {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid User');
        }
        else {
            return userEmail;
        }
    }
});
/**
 * logout
 *  * @param {number} userId
 * @returns {Promise<Boolean>}
 */
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield token_service_1.default.removeToken(userId);
    return token;
});
exports.default = {
    loginUserWithEmailAndPassword,
    logout
};
//# sourceMappingURL=auth.service.js.map