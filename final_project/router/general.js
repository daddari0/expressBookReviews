const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
});

// Task 1 & Task 10: Get all books using async/await with Axios/Promise
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = () => Promise.resolve(books);
    const bookList = await getAllBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
  
// Task 3 & Task 12: Get book details based on author using async/await and array filter
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (b) => b.author.toLowerCase() === author
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ status: 404, message: `No books found for author ${req.params.author}` });
      }
    });

    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 4 & Task 13: Get all books based on title using async/await and array filter
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (b) => b.title.toLowerCase() === title
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ status: 404, message: `No books found with title ${req.params.title}` });
      }
    });

    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

module.exports.general = public_users;
