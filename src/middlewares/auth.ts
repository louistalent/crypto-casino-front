import { tokenTypes } from '../config/tokens';
import tokenservice from '../services/token.service';
const httpStatus = require('http-status');

export interface AuthRequest extends Request {
    user?: any;
    file?: any;
    query?: any;
}

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization as string;
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: 'Please authenticate. '
            });
        }

        const session = await tokenservice.verifyToken(token, tokenTypes.ACCESS);
        if (session) {
            req.user = session.user;
            next();
        } else {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: 'Invalid token'
            });
        }
    } catch {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: 'Invalid token'
        });
    }
};

export default auth;
