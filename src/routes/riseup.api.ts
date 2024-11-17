import express from 'express';

import { initgames, openGame, getBalance, setPlay } from '../controllers/riseupAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/initgames', initgames);

router.post('/opengame', auth, openGame);
router.post('/callback/GetBalance', getBalance);
router.post('/callback/SetPlay', setPlay);

export default router;
