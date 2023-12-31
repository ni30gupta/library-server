const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
// const LibraryTransaction = require('../models/libraryTransactionModel');


const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const token = bearerHeader.split(' ')[1];
    console.log('token...',token)

    jwt.verify(token, process.env.jwt_key, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Token Invalid!' });
      } else {
        req.user = decoded; // Store user information in the request object
        console.log('decoded...',decoded)
        if (decoded.role === 'admin') {
          // User is an admin
          next();
        } else {
          res.status(403).json({ error: 'User does not have admin privileges!' });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'Token not provided!' });
  }
};


// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific book by ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});


// Add a new book
router.post('/', verifyToken, async (req, res) => {
  const { name, author } = req.body;


  try {
    const newBook = new Book({ name, author });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update book details
router.put('/:id', getBook, async (req, res) => {
  const { name, author, status } = req.body;

  if (name) res.book.name = name;
  if (author) res.book.author = author;
  if (status) res.book.status = status;

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a book by ID
router.delete('/:id', getBook, async (req, res) => {
  try {
    await res.book.remove();
    res.json({ message: 'Book removed from the inventory' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a specific book by ID
async function getBook(req, res, next) {
  let book;

  try {
    book = await Book.findById(req.params.id);
    if (book === null) {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.book = book;
  next();
}

module.exports = router;
