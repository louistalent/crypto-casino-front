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
exports.me = exports.logout = exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
const { lookup } = require('geoip-lite');
const useragent = require('express-useragent');
// export const get_ipaddress = (req) => {
//     var forwarded = req.headers['x-forwarded-for'];
//     var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
//     var ip = ips && ips.length > 0 && ips.indexOf(',') ? ips.split(',')[0] : null;
//     return ip;
// };
exports.register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield services_1.userService.createUser(req.body, req);
    const accessToken = yield services_1.tokenService.generateAuthTokens(user);
    res.status(http_status_1.default.CREATED).send({ user, accessToken });
}));
exports.login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield services_1.authService.loginUserWithEmailAndPassword(email, password);
    const isPasswordMatch = yield user.isPasswordMatch(password);
    if (!isPasswordMatch) {
        return res.status(http_status_1.default.UNAUTHORIZED).send({
            message: 'Invalid credentials'
        });
    }
    yield services_1.userService.ipUpdate(user, req.body.ipAddress);
    // --------------------------------------------------------------------------------------ip
    const source = req.headers['user-agent'];
    const ua = useragent.parse(source);
    const ip = req.body.ipAddress;
    if (ip) {
        const activeSession = {
            user_id: user._id,
            ip: req.body.ipAddress,
            country: lookup(ip).country,
            city: lookup(ip).city,
            browser: ua.browser,
            os: ua.os,
            device: ua.isMobile ? 'Mobile' : 'Desktop'
        };
        yield services_1.userService.createSession(activeSession);
    }
    //  -------------------------------------------------------------------------ip end
    // await userService.createLoginInfo(email);
    const accessToken = yield services_1.tokenService.generateAuthTokens(user);
    return res.send({ user, accessToken });
}));
exports.logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const logout = yield services_1.authService.logout(user._id);
    return res.send(logout);
}));
exports.me = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_1.default.OK).send({ user: req.user });
}));
//# sourceMappingURL=auth.js.map