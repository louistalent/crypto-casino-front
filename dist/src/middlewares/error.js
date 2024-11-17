"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../config/logger"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = require("@prisma/client");
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.default)) {
        const statusCode = error.statusCode || error instanceof client_1.Prisma.PrismaClientKnownRequestError
            ? http_status_1.default.BAD_REQUEST
            : http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_1.default[statusCode];
        error = new ApiError_1.default(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config_1.default.env === 'production' && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = http_status_1.default[http_status_1.default.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (config_1.default.env === 'development' && { stack: err.stack }));
    if (config_1.default.env === 'development') {
        logger_1.default.error(err);
    }
    console.log('send error: ' + statusCode + ' ' + JSON.stringify(response));
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map