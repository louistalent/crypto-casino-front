import express from 'express';
import path from 'path';

import cors from 'cors';

import routes from './routes';

import { errorConverter, errorHandler } from './middlewares/error';

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public/avatar')));
app.use(express.static(path.join(__dirname, '../public/tasks')));
app.use(express.static(path.join(__dirname, '../public/files')));
app.use(express.static(path.join(__dirname, '../public/build')));
app.use(express.static(path.join(__dirname, '../public/images')));

app.use('/api', routes);
// app.use('*', pageRoute);

app.use(errorConverter);

app.use(errorHandler);

export default app;
