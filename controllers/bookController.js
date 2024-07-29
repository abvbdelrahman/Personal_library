const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks = catchAsync(async (req, res, next) => {
        const books = await Book.find({});
        res.status(200).json(books);
});

exports.getBookById = catchAsync(async (req, res, next) => {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    
});

exports.createBook = catchAsync(async (req, res, next) => {
    const book = await Book.create(req.body);
    console.log(book);
    res.status(201).json({
        status: 'Created',
        book
        
});
});

exports.updateBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
});

exports.deleteBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).json({ message: 'Book deleted successfully' });
});

exports.searchBooks = catchAsync(async (req, res, next) => {
    const { title, author } = req.body;
    const query = {};
    if (title) query.title = new RegExp(title, 'i');
    if (author) query.author = new RegExp(author, 'i');
    const books = await Book.find(query);
    if (!books.length) {
        return res.status(404).json({ message: 'No books found matching your criteria.' });
    }

    res.status(200).json({
        status: 'success',
        results: books.length,
        data: books
    });
}); 