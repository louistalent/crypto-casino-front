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
const tokens_1 = require("../config/tokens");
const token_service_1 = __importDefault(require("../services/token.service"));
const httpStatus = require('http-status');
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: 'Please authenticate. '
            });
        }
        const session = yield token_service_1.default.verifyToken(token, tokens_1.tokenTypes.ACCESS);
        if (session) {
            req.user = session.user;
            next();
        }
        else {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: 'Invalid token'
            });
        }
    }
    catch (_a) {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: 'Invalid token'
        });
    }
});
exports.default = auth;
//# sourceMappingURL=auth.js.map