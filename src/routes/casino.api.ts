import express from 'express';

import {
    initgames,
    provider,
    gamelist,
    openGame,
    gamehistory,
    getJackpot,
    getmessage,
    isReadMessage,
    categoryProviderChange,
    allgameget,
    searchGame,
    eachgameget
    // callback,
    // livegamelist,
    // virtualgamelist,
} from '../controllers/casinoAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/initgames', initgames);

router.post('/provider', provider);
router.post('/gamelist', gamelist);
router.post('/allgameget', allgameget);
router.post('/opengame', auth, openGame);
router.post('/history', auth, gamehistory);
router.get('/getJackpot', getJackpot);
router.get('/getMessage', auth, getmessage);
router.post('/isReadMessage', auth, isReadMessage);
router.post('/category_provider_change', categoryProviderChange);
router.post('/searchgame', searchGame);
router.post('/eachgameget', eachgameget);
// router.post('/liveCasinolist', livegamelist);
// router.post('/virtualgamelist', virtualgamelist);
// router.post('/callback', callback);

export default router;
