import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { pragmaticService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const initgames = catchAsync(async (req: Request, res: Response) => {
    const result = await pragmaticService.initGames();
    res.send(result);
});

export const openGame = catchAsync(async (req: AuthRequest, res: Response) => {
    const gamePlay = await pragmaticService.openGame(req.body, req.user);
    res.send(gamePlay);
});

export const getBalance = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await pragmaticService.getBalance(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const betWin = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await pragmaticService.betWin(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const withdraw = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await pragmaticService.withdraw(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const deposit = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await pragmaticService.deposit(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});

export const rollback = catchAsync(async (req: Request, res: Response) => {
    const gamePlay = await pragmaticService.rollback(req.body);
    res.setHeader('content-type', 'application/json');
    res.send(gamePlay);
});
