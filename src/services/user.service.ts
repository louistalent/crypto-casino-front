import httpStatus from 'http-status';
import User from '../models/user.model';
import Transactions from '../models/transactions.model';
import ActiveSession from '../models/session.model';

import ApiError from '../utils/ApiError';
import { getAccessIpaddress } from '../utils/library';
import bcrypt from 'bcryptjs';

const axios = require('axios');

/**
 * Get user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUserById = async (_id: string) => {
    return User.findOne({ _id });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username: string) => {
    return await User.findOne({ username });
};

/**
 * remove user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const removeUserById = async (_id: string) => {
    return User.findOneAndDelete({ _id });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

type createUserProps = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    username?: string;
    roleId?: string;
    status?: string;
    parent_id?: string;
    birthday?: string;
    country?: string;
    currency?: string;
    balance?: number;
};

const createUser = async (
    { email, firstname, username, lastname, password, roleId, status, country, currency }: createUserProps,
    req: any
) => {
    let ip = getAccessIpaddress(req);
    let data = {
        email,
        username: username ?? `AreaCasino-${new Date().valueOf()}`,
        firstname,
        lastname,
        password,
        status,
        country,
        currency,
        roleId: 'user',
        ip
    } as any;

    // if (roleId) {
    //     data = {
    //         ...data,
    //         role: {
    //             connect: {
    //                 slug: roleId
    //             }
    //         }
    //     };
    // }

    // let exist = await getUserByEmail(email);
    // let existUserName = await getUserByUsername(username);
    console.log(username, '--username--');
    if (await User.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    } else if (await User.isUsernameTaken(username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    } else {
        return User.create(data)
            .then((user: any) => {
                return user;
            })
            .catch((error: any) => {
                throw new ApiError(httpStatus.BAD_REQUEST, error.message);
            });
    }
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const getAllUsers = async () => {
    return await User.find();
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    } else {
        await removeUserById(userId);
    }
    return user;
};

/**
 * Delete users by id
 * @param {Array} userIds
 * @returns {Promise<Number>}
 */
const deleteUsersById = async (userIds) => {
    let failedUserIds = [];
    for (let id of userIds) {
        const user = await getUserById(id);
        if (!user) failedUserIds.push(id);
        else removeUserById(id);
    }
    return failedUserIds;
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: any) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    if (updateBody.avatarUrl && updateBody.avatarUrl.startsWith('http')) {
        updateBody.avatarUrl = updateBody.avatarUrl.split('/').pop();
    }
    try {
        if (updateBody.password !== '') {
            updateBody.password = await bcrypt.hash(updateBody.password, 8);
        }

        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateBody, { new: true });
        return updatedUser;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const createLoginInfo = async (email: string) => {
    const loginInfo = await axios.get('https://ipapi.co/json/');
    console.log(loginInfo, 'loginInfo', email);
};

const getTransactions = async (user: any) => {
    console.log('get transaction');
    const transaction = await Transactions.find({ $or: [{ from: user.username }, { to: user.username }] }).sort({
        date: -1
    });
    return transaction;
};

// create session
const createSession = async (data: any) => {
    ActiveSession.create(data)
        .then((data: any) => {
            console.log('--active session create--');
        })
        .catch((error: any) => {
            console.log(error);
        });
};

// ipUpdate
const ipUpdate = async (user: any, ip_address: any) => {
    await User.updateOne({ _id: user._id }, { ip: ip_address });
};

export default {
    createUser,
    updateUserById,
    getUserByEmail,
    getUserByUsername,
    getAllUsers,
    getUserById,
    deleteUserById,
    deleteUsersById,
    createLoginInfo,
    getTransactions,
    createSession,
    ipUpdate
};
