import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { sportsbookService, casinoService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const verifyParams = catchAsync((req: AuthRequest, res: Response, next) => {
    sportsbookService.verifyParams(req, res, next);
});

export const profile = catchAsync(async (req: Request, res: Response) => {
    const { profile, status } = await sportsbookService.profile(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
});

export const balance = catchAsync(async (req: Request, res: Response) => {
    const { profile, status } = await sportsbookService.balance(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
});

export const bet = catchAsync(async (req: Request, res: Response) => {
    const { profile, status } = await sportsbookService.bet(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
});

export const settledBet = catchAsync(async (req: Request, res: Response) => {
    const { profile, status } = await sportsbookService.settledBet(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
});
export const betcheck = catchAsync(async (req: Request, res: Response) => {
    const { profile, status } = await sportsbookService.betcheck(req);
    res.setHeader('content-type', 'application/json');
    return res.status(status).json(profile);
});

export const initGames = catchAsync(async (req: Request, res: Response) => {
    const initgames = await casinoService.sportsinitGames();
    return res.status(200).json(initgames);
});

export const opengame = catchAsync(async (req: AuthRequest, res: Response) => {
    const initgames = await casinoService.opengame(req.user);
    return res.status(200).json(initgames);
});
