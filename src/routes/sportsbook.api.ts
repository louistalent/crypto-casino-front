import express from 'express';

import {
    verifyParams,
    profile,
    balance,
    bet,
    settledBet,
    betcheck,
    initGames,
    opengame
} from '../controllers/sportsAPI';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/user/profile', verifyParams, profile);
router.post('/user/balance', verifyParams, balance);
router.post('/payment/bet', verifyParams, bet);

router.put('/payment/bet', verifyParams, settledBet);

router.post('/payment/check', verifyParams, betcheck);

router.get('/initgames', initGames);

router.get('/open', auth, opengame);

export default router;
