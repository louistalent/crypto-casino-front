import express from 'express';

import {
    initgames,
    gamelist,
    providerGameList,
    gamePlay,
    // callbackget,
    livegamelist,
    virtualgamelist,
    searchGame
    // callbackpost
} from '../controllers/zeusCasino';

import { callbackget, callbackpost } from '../controllers/casinoAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/initgames', initgames);

router.post('/list', gamelist);
router.post('/liveCasinolist', livegamelist);
router.post('/virtualgamelist', virtualgamelist);
router.post('/providergame', providerGameList);
router.post('/getGame', auth, gamePlay);
router.post('/searchgame', searchGame);
router.get('/callback/get', callbackget);
router.get('/callback/post', callbackpost);

export default router;
