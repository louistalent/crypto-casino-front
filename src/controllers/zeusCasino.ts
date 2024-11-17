import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { zeusCasinoService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const initgames = async () => {
    await zeusCasinoService.initGames();
};

export const gamelist = catchAsync(async (req, res: Response) => {
    const gameList = await zeusCasinoService.gamelist();
    res.send(gameList);
});

export const livegamelist = catchAsync(async (req, res: Response) => {
    const gameList = await zeusCasinoService.livegamelist();
    res.send(gameList);
});

export const virtualgamelist = catchAsync(async (req, res: Response) => {
    const gameList = await zeusCasinoService.virtualgamelist();
    res.send(gameList);
});

export const providerGameList = catchAsync(async (req: Request, res: Response) => {
    const gameList = await zeusCasinoService.providerGameList(req.body);
    res.send(gameList);
});

export const gamePlay = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamePlay = await zeusCasinoService.openGame(req.body, req.user);
    res.send(gamePlay);
});

export const searchGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await zeusCasinoService.searchGame(req.body);
    res.send(result);
});

export const callbackget = catchAsync(async (req: AuthRequest, res: Response) => {
    const callback = await zeusCasinoService.callbackget(req.query);
    res.send(callback);
});

export const callbackpost = catchAsync(async (req: AuthRequest, res: Response) => {
    const callback = await zeusCasinoService.callbackpost(req.query);
    res.send(callback);
});
