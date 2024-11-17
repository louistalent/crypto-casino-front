import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { multigamesService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const initgames = catchAsync(async (req: Request, res: Response) => {
    const result = await multigamesService.initGames();
    res.send(result);
});

export const openGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamePlay = await multigamesService.openGame(req.body, req.user);
    res.send(gamePlay);
});

export const Authenticate = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await multigamesService.Authenticate(req.body);
    res.send(gamePlay);
});

export const getBalance = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await multigamesService.getBalance(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const withdraw = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await multigamesService.withdraw(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const deposit = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await multigamesService.deposit(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});
