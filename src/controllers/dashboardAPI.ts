import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

import { dashboardService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const selectCategory = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await dashboardService.selectCategory(req.user);
    res.send(result);
});

export const setFreeBonus = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await dashboardService.setFreeBonus(req.user, req.body);
    res.send(result);
});

export const getFreeBonus = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await dashboardService.getFreeBonus(req.user);
    res.send(result);
});
