"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
const transactions_model_1 = __importDefault(require("../models/transactions.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const library_1 = require("../utils/library");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios = require('axios');
/**
 * Get user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findOne({ _id });
});
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOne({ email });
});
/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findOne({ username });
});
/**
 * remove user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const removeUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findOneAndDelete({ _id });
});
const createUser = ({ email, firstname, username, lastname, password, roleId, status, country, currency }, req) => __awaiter(void 0, void 0, void 0, function* () {
    let ip = (0, library_1.getAccessIpaddress)(req);
    let data = {
        email,
        username: username !== null && username !== void 0 ? username : `AreaCasino-${new Date().valueOf()}`,
        firstname,
        lastname,
        password,
        status,
        country,
        currency,
        roleId: 'user',
        ip
    };
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
    if (yield user_model_1.default.isEmailTaken(email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    else if (yield user_model_1.default.isUsernameTaken(username)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Username already taken');
    }
    else {
        return user_model_1.default.create(data)
            .then((user) => {
            return user;
        })
            .catch((error) => {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, error.message);
        });
    }
});
/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.find();
});
/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    else {
        yield removeUserById(userId);
    }
    return user;
});
/**
 * Delete users by id
 * @param {Array} userIds
 * @returns {Promise<Number>}
 */
const deleteUsersById = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    let failedUserIds = [];
    for (let id of userIds) {
        const user = yield getUserById(id);
        if (!user)
            failedUserIds.push(id);
        else
            removeUserById(id);
    }
    return failedUserIds;
});
/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (yield user_model_1.default.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    if (updateBody.username && (yield user_model_1.default.isUsernameTaken(updateBody.username, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Username already taken');
    }
    if (updateBody.avatarUrl && updateBody.avatarUrl.startsWith('http')) {
        updateBody.avatarUrl = updateBody.avatarUrl.split('/').pop();
    }
    try {
        if (updateBody.password !== '') {
            updateBody.password = yield bcryptjs_1.default.hash(updateBody.password, 8);
        }
        const updatedUser = yield user_model_1.default.findOneAndUpdate({ _id: userId }, updateBody, { new: true });
        return updatedUser;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const createLoginInfo = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield axios.get('https://ipapi.co/json/');
    console.log(loginInfo, 'loginInfo', email);
});
const getTransactions = (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('get transaction');
    const transaction = yield transactions_model_1.default.find({ $or: [{ from: user.username }, { to: user.username }] }).sort({
        date: -1
    });
    return transaction;
});
// create session
const createSession = (data) => __awaiter(void 0, void 0, void 0, function* () {
    session_model_1.default.create(data)
        .then((data) => {
        console.log('--active session create--');
    })
        .catch((error) => {
        console.log(error);
    });
});
// ipUpdate
const ipUpdate = (user, ip_address) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.updateOne({ _id: user._id }, { ip: ip_address });
});
exports.default = {
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
//# sourceMappingURL=user.service.js.map