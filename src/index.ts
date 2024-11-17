// @ts-ignore
import * as mongoose from 'mongoose';
import app from './devapp';
import config from './config/config';
import logger from './config/logger';

// @ts-ignore
const main = async () => {
    let server: any;

    mongoose.set('strictQuery', true);
    await mongoose
        .connect(config.mongoose.url)
        .then(() => {
            console.log('--database connection successful--');
        })
        .catch((err) => {
            console.log('--error connecting to database---');
        });

    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                logger.info('Server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedErrorHandler = (error: any) => {
        logger.error(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
        if (server) {
            server.close();
        }
    });
};

main();
