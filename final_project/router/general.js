const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 2 & 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
  
// Task 3 & 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getByAuthor = new Promise((resolve, reject) => {
      let filtered = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filtered.push(books[key]);
        }
      });
      resolve(filtered);
    });

    const result = await getByAuthor;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 4 & 13: Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getByTitle = new Promise((resolve, reject) => {
      let filtered = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filtered.push(books[key]);
        }
      });
      resolve(filtered);
    });

    const result = await getByTitle;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
