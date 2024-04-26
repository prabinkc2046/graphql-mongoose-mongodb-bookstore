//imports
const mongoose = require('mongoose');

// define schema
// author and book
// one author can have multiple books

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
});

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
});

// create model
const Author = mongoose.model('Author', authorSchema);

const Book = mongoose.model('Book', bookSchema);

// export

module.exports = {
    Author,
    Book
};