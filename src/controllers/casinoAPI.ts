import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { casinoService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const initgames = catchAsync(async (req: Request, res: Response) => {
    await casinoService.initGames();
    res.send('ok');
});

export const provider = catchAsync(async (req: Request, res: Response) => {
    const gameList = await casinoService.provider(req.body);
    res.send(gameList);
});

export const gamelist = catchAsync(async (req: Request, res: Response) => {
    const gameList = await casinoService.gamelist(req.body);
    res.send(gameList);
});

export const allgameget = catchAsync(async (req: Request, res: Response) => {
    const gameList = await casinoService.allgameget(req.body);
    res.send(gameList);
});

export const openGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamePlay = await casinoService.openGame(req.body, req.user);
    res.send(gamePlay);
});

export const callbackget = catchAsync(async (req: Request, res: Response) => {
    const callback = await casinoService.callbackget(req.query);
    res.send(callback);
});

export const callbackpost = catchAsync(async (req: Request, res: Response) => {
    const callback = await casinoService.callbackpost(req.query);
    res.send(callback);
});

export const gamehistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamehistory = await casinoService.gamehistory(req.user);
    res.send(gamehistory);
});

export const getJackpot = catchAsync(async (req: AuthRequest, res: Response) => {
    const jackpot = await casinoService.getJackpot();
    res.send(jackpot);
});

export const getmessage = catchAsync(async (req: AuthRequest, res: Response) => {
    const jackpot = await casinoService.getmessage(req.user);
    res.send(jackpot);
});

export const isReadMessage = catchAsync(async (req: AuthRequest, res: Response) => {
    const jackpot = await casinoService.isReadMessage(req.user);
    res.send(jackpot);
});

export const categoryProviderChange = catchAsync(async (req: AuthRequest, res: Response) => {
    const jackpot = await casinoService.categoryProviderChange();
    res.send(jackpot);
});

export const searchGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await casinoService.searchGame(req.body);
    res.send(result);
});

export const eachgameget = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await casinoService.eachgameget(req.body);
    res.send(result);
});
// export const livegamelist = catchAsync(async (req, res: Response) => {
//     const gameList = await casinoService.livegamelist();
//     res.send(gameList);
// });

// export const virtualgamelist = catchAsync(async (req, res: Response) => {
//     const gameList = await casinoService.virtualgamelist();
//     res.send(gameList);
// });

// export const callback = catchAsync(async (req: AuthRequest, res: Response) => {
//     const callback = await casinoService.callback(req.body);
//     res.send(callback);
// });
