//imports
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");


//import model for book and authors
const {Book, Author} = require('./model');


//  connect to database
mongoose.connect('mongodb://192.168.20.7:27017/bookstore')
.then (() => {
    console.log("Connected to MongoDB");
})
.catch ((error) => {
    console.error("Error connecting to MongoDB", error)
})

async function startServer () {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type Author {
            id: ID!
            name: String!
            email: String!
        }

        type Book {
            id: ID!
            title: String!
            isbn: String!
            authorId: ID!
            author: Author
        }

        type Query {
            books: [Book!]!
            authors: [Author!]!
        }
        
        type Mutation {
            addAuthor(name: String!, email: String!): Author
            addBook(title: String!, isbn: String!, authorId: ID!): Book
            updateBook(id: ID!, title: String, isbn: String, authorId: ID): Book
            deleteBook(id: ID!): Book
        }
    `,
    resolvers: {
        Query: {
            books: async () => {
                const books = await Book.find();
                return books;
            },
            authors: async () => {
                const authors = await Author.find();
                return authors;
            },
        },
        Book: {
            author: async (book) => {
                const author = await Author.findById(book.authorId);
                return author;
            },
        },
        Mutation: {
            addAuthor: async (_, {name, email}) => {
                const author = new Author({name, email});
                author.save();
                return author;
            },
            addBook: async (_, {title, isbn, authorId }) => {
                const book = new Book({title, isbn, authorId});
                book.save();
                return book;
            },
            updateBook: async (_, { id, title, isbn, authorId}) => {
                const updatedBook = await Book.findByIdAndUpdate(id, {title, isbn, authorId }, { new: true});
                return updatedBook;
            },
            deleteBook: async (_, { id }) => {
                const deletedBook = await Book.findByIdAndDelete(id);
                return deletedBook;
            },
        },
    },

    });
    app.use(bodyParser.json());
    app.use(cors());
    await server.start();
    app.use("/graphql", expressMiddleware(server));
    app.listen(8000, () => {
        console.log(`Server is ready at 8000`);
    });
};

startServer();


