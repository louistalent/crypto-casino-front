import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { riseupCasinoService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const initgames = catchAsync(async (req: Request, res: Response) => {
    const result = await riseupCasinoService.initGames();
    res.send(result);
});

export const openGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamePlay = await riseupCasinoService.openGame(req.body, req.user);
    res.send(gamePlay);
});

export const getBalance = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await riseupCasinoService.getBalance(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});
export const setPlay = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await riseupCasinoService.setPlay(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});
