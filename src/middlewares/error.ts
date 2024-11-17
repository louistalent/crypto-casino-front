import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

import { Prisma } from '@prisma/client';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
                ? HttpStatusCodes.BAD_REQUEST
                : HttpStatusCodes.INTERNAL_SERVER_ERROR;
        const message = error.message || HttpStatusCodes[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        message = HttpStatusCodes[HttpStatusCodes.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack })
    };

    if (config.env === 'development') {
        logger.error(err);
    }
    console.log('send error: ' + statusCode + ' ' + JSON.stringify(response));
    res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
