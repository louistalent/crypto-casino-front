"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.number().default(5000),
    SESSION_SECRET: joi_1.default.string().required().description('Express Session Secret'),
    SESSION_COOKIE_NAME: joi_1.default.string().required().description('Express Session Cookie Name'),
    JWT_SECRET: joi_1.default.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number().default(60).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number().default(60).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(60)
        .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(60)
        .description('minutes after which verify email token expires'),
    SMTP_HOST: joi_1.default.string().description('server that will send the emails'),
    SMTP_PORT: joi_1.default.number().description('port to connect to the email server'),
    SMTP_USERNAME: joi_1.default.string().description('username for email server'),
    SMTP_PASSWORD: joi_1.default.string().description('password for email server'),
    EMAIL_FROM: joi_1.default.string().description('the from field in the emails sent by the app')
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    session: {
        secret: envVars.SESSION_SECRET,
        cookieName: envVars.SESSION_COOKIE_NAME
    },
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        tokenTypes: {
            ACCESS: 'access',
            REFRESH: 'refresh',
            RESET_PASSWORD: 'resetPassword',
            VERIFY_EMAIL: 'verifyEmail'
        }
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD
            }
        },
        from: envVars.EMAIL_FROM
    }
};
//# sourceMappingURL=config.js.map