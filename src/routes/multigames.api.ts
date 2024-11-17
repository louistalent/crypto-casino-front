import express from 'express';

import { initgames, openGame, Authenticate, getBalance, withdraw, deposit } from '../controllers/multigamesAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/initgames', initgames);

router.post('/opengame', auth, openGame);
router.post('/callback/Authenticate', Authenticate);
router.post('/callback/GetBalance', getBalance);
router.post('/callback/Withdraw', withdraw);
router.post('/callback/Deposit', deposit);

export default router;
