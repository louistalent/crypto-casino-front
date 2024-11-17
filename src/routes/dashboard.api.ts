import express from 'express';

import { selectCategory, setFreeBonus, getFreeBonus } from '../controllers/dashboardAPI';

import auth from '../middlewares/auth';
const router = express.Router();

router.get('/selectCategory', auth, selectCategory);
router.post('/setFreeBonus', auth, setFreeBonus);
router.get('/getFreeBonus', auth, getFreeBonus);

export default router;
