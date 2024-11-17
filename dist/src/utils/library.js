"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessIpaddress = exports.getRandomDigit = void 0;
const getRandomDigit = () => {
    let a = new Date().valueOf().toString();
    return Number(a.slice(a.length - 1 - 7, a.length - 1));
};
exports.getRandomDigit = getRandomDigit;
const getAccessIpaddress = (req) => {
    let forwarded = req.headers['x-forwarded-for'];
    let ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    let ip = ips && ips.length > 0 && ips.indexOf(',') ? ips.split(',')[0] : null;
    return ip;
};
exports.getAccessIpaddress = getAccessIpaddress;
//# sourceMappingURL=library.js.map