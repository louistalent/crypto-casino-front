import HttpStatusCodes from 'http-status';
// import tokenService from './token.service';
// import Token from '../models/token.model';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import tokenService from './token.service';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
    const userEmail = await userService.getUserByEmail(email);
    const user = await userService.getUserByUsername(email);
    if (!userEmail && !user) {
        throw new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Incorrect email');
    } else if (!userEmail && user) {
        if (user.roleId !== 'user') {
            throw new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Invalid User');
        } else {
            return user;
        }
    } else {
        if (user.roleId !== 'user') {
            throw new ApiError(HttpStatusCodes.UNAUTHORIZED, 'Invalid User');
        } else {
            return userEmail;
        }
    }
};

/**
 * logout
 *  * @param {number} userId
 * @returns {Promise<Boolean>}
 */
const logout = async (userId: string): Promise<any> => {
    const token = await tokenService.removeToken(userId);
    return token;
};

export default {
    loginUserWithEmailAndPassword,
    logout
};
