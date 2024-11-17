import express from 'express';
import path from 'path';

import cors from 'cors';

import routes from './routes';

import { errorConverter, errorHandler } from './middlewares/error';
const dir = require('../../dir');

const app = express();

app.use(cors());
app.options('*', cors());

app.set('trust proxy', true);
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static(path.join(dir.dir, './build')));
app.use(express.static(path.join(dir.dir, './public/avatar')));
app.use(express.static(path.join(dir.dir, './dist/src/public/avatar')));
app.use(express.static(path.join(dir.dir, './public/tasks')));
app.use(express.static(path.join(dir.dir, './public/files')));
app.use(express.static(path.join(dir.dir, './public/build')));
app.use(express.static(path.join(dir.dir, './public/images')));

app.use('/api', routes);
// app.use('*', pageRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(dir.dir, './build/index.html'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
