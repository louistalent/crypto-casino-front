"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const httpStatus = __importStar(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../config/config"));
const token_model_1 = __importDefault(require("../models/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_service_1 = __importDefault(require("./user.service"));
const { tokenTypes } = require('../config/tokens');
// @ts-ignore
// @ts-ignore
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, type, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        type
    };
    return jwt.sign(payload, secret);
};
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = (token, userId, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_model_1.default.create({
        token,
        user: userId,
        type,
        blacklisted
    });
    return tokenDoc;
});
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = jwt.verify(token, config_1.default.jwt.secret);
    const tokenDoc = yield token_model_1.default.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false
    }).populate('user');
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
});
/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = generateToken(user._id, tokenTypes.ACCESS);
    yield saveToken(accessToken, user._id, tokenTypes.ACCESS);
    return accessToken;
});
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.default.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    yield saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
});
/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    yield saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
});
const removeToken = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield token_model_1.default.deleteMany({ user: userid });
    return res;
});
exports.default = {
    generateToken,
    saveToken,
    verifyToken,
    removeToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken
};
//# sourceMappingURL=token.service.js.map