import express from 'express';

import { initgames, openGame, getBalance, rollback, betWin, withdraw, deposit } from '../controllers/pragmaticAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/initgames', initgames);

router.post('/opengame', auth, openGame);
router.post('/callback/GetBalance', getBalance);
router.post('/callback/BetWin', betWin);
router.post('/callback/Withdraw', withdraw);
router.post('/callback/Deposit', deposit);
router.post('/callback/RollbackTransaction', rollback);

export default router;
