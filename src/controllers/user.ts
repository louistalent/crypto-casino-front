import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import { userService } from '../services';
import { AuthRequest } from 'middlewares/auth';

export const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body, req);
    res.status(httpStatus.CREATED).send({ user });
});

export const getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await userService.getAllUsers();
    res.send(result);
});

export const getUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserById(req.user);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

export const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
    await userService.deleteUserById(req.user);
    res.status(httpStatus.NO_CONTENT).send();
});

export const deleteUsers = catchAsync(async (req: Request, res: Response) => {
    const failedUserIds = await userService.deleteUsersById(req.body.ids);
    res.status(httpStatus.OK).send(failedUserIds);
});

export const updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.updateUserById(req.user._id, req.body);
    return res.send({ user });
});

export const getTransactions = catchAsync(async (req: AuthRequest, res: Response) => {
    const getTransaction = await userService.getTransactions(req.user);
    return res.send(getTransaction);
});
