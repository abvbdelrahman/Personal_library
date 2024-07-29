const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'A book must have a title'],
        unique: true,
        trim: true
    },
    author: { 
        type: String, 
        required: [true, 'A book must have an author'],
        trim: true
    },
    publicationYear: { 
        type: Number, 
        required: [true, 'A book must have a publication year'],
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Publication year must be a positive number'
        }
    },
    pages: { 
        type: Number, 
        required: [true, 'A book must have a number of pages'],
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Number of pages must be a positive number'
        }
    },
    debugger: { 
        type: String, 
        required: [true, 'A book must have a debugger field'],
        trim: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
