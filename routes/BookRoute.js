const express = require('express');
const bookController = require('../controllers/bookController')
const Auth = require('../controllers/auth');

const router = express.Router();
router.use(Auth.protect);
router
    .route('/')
    .get(bookController.getAllBooks)
    .post(Auth.restrictTo('admin'), bookController.createBook);

router
    .route('/search')
    .post(bookController.searchBooks);

router
    .route('/:id')
    .get(bookController.getBookById)
    .patch(Auth.restrictTo('admin'), bookController.updateBook)
    .delete(Auth.restrictTo('admin'), bookController.deleteBook)

module.exports = router;