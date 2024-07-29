const express = require('express');
const userController = require('../controllers/userController')
const Auth = require('../controllers/auth');

const router = express.Router();
router
    .route('/register')
    .post(Auth.signup)

router
    .route('/login')
    .post(Auth.login)


router
    .route('/logout')
    .get(Auth.logout)
router.use(Auth.protect)
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUserById)
    .patch( userController.updateUser)
    .delete(Auth.restrictTo('admin'), userController.deleteUser)


module.exports = router;