import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync';

import { authService, userService, tokenService } from '../services';
import { AuthRequest } from 'middlewares/auth';

const { lookup } = require('geoip-lite');
const useragent = require('express-useragent');

// export const get_ipaddress = (req) => {
//     var forwarded = req.headers['x-forwarded-for'];
//     var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
//     var ip = ips && ips.length > 0 && ips.indexOf(',') ? ips.split(',')[0] : null;
//     return ip;
// };

export const register = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body, req);
    const accessToken = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, accessToken });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const isPasswordMatch = await user.isPasswordMatch(password);
    if (!isPasswordMatch) {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: 'Invalid credentials'
        });
    }
    await userService.ipUpdate(user, req.body.ipAddress);
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
        await userService.createSession(activeSession);
    }

    //  -------------------------------------------------------------------------ip end
    // await userService.createLoginInfo(email);
    const accessToken = await tokenService.generateAuthTokens(user);
    return res.send({ user, accessToken });
});

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const logout = await authService.logout(user._id);
    return res.send(logout);
});

export const me = catchAsync(async (req: AuthRequest, res: Response) => {
    res.status(httpStatus.OK).send({ user: req.user });
});
