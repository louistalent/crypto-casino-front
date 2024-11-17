import express from 'express';
import { createValidator } from 'express-joi-validation';

import { login, register, logout, me } from '../controllers/auth';

import VSchema from '../middlewares/validation';
import auth from '../middlewares/auth';

const router = express.Router();
const validator = createValidator();

router.post('/login', validator.body(VSchema.Login), login);
router.post('/register', validator.body(VSchema.Register), register);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

export default router;
