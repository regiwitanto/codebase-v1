const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const basicAuth = require('../helpers/auth/basic_auth_helper');
const jwtAuth = require('../helpers/auth/jwt_auth_helper');

router.post('/', basicAuth.isAuthenticated, userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:userId', jwtAuth.verifyToken, userController.getUser);
router.put('/:userId', jwtAuth.verifyToken, userController.updateUser);
router.delete('/:userId', jwtAuth.verifyToken, userController.deleteUser);
router.post('/login', basicAuth.isAuthenticated, userController.loginUser);

module.exports = router;
