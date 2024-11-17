// import express from 'express';
// import { createValidator } from 'express-joi-validation';
// import { createRole, getAllRoles, getRole, updateRole, deleteRole } from '../controllers/role';
// import VSchema from '../middlewares/validation';
// import auth from '../middlewares/auth';
// const router = express.Router();
// const validator = createValidator();
// router.route('/').get(auth, getAllRoles).post(auth, validator.body(VSchema.createRole), createRole);
// router
//     .route('/:roleId')
//     .get(auth, validator.params(VSchema.roleId), getRole)
//     .put(auth, validator.params(VSchema.roleId), validator.body(VSchema.updateRole), updateRole)
//     .delete(auth, validator.params(VSchema.roleId), deleteRole);
// export default router;
//# sourceMappingURL=role.route.js.map