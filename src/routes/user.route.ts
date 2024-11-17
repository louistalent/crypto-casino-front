import express from 'express';
import { createValidator } from 'express-joi-validation';

import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    deleteUsers,
    getTransactions
} from '../controllers/user';

import VSchema from '../middlewares/validation';
import auth from '../middlewares/auth';
import { uploadAvatar } from '../middlewares/upload';
// import { uploadValdiation } from '../middlewares/uploadValidation';

const router = express.Router();
const validator = createValidator();

router.route('/').get(auth, getAllUsers);

router.route('/').post(
    auth,
    uploadAvatar,
    // uploadValdiation(VSchema.createUser, 'avatar/'),
    validator.body(VSchema.createUser),
    createUser
);

router.route('/remove').post(auth, validator.body(VSchema.remove), deleteUsers);
router
    .route('/:userId')
    .get(auth, validator.params(VSchema.userId), getUser)
    .put(
        auth,
        uploadAvatar,
        // uploadValdiation(VSchema.updateUser, 'avatar/'),
        // validator.params(VSchema.userId),
        // validator.body(VSchema.updateUser),
        updateUser
    )
    .delete(auth, validator.params(VSchema.userId), deleteUser);

// get Transactions

router.post('/getTransaction', auth, getTransactions);

export default router;
