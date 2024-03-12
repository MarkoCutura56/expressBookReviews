const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', function (req, res) {

  let myPromise = new Promise((resolve, reject) => {

    let bookList = '';
    for (const [key, value] of Object.entries(books)) {
      bookList = bookList + value.title + "<br/>";
    }
    resolve(bookList);
  });

  myPromise.then((successMessage) => { return res.send(successMessage) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  let myPromise = new Promise((resolve, reject) => {
    isbnNumber = req.params.isbn;
    if (isbnNumber in books) {

      resolve(books[isbnNumber].title);
    }
    else {
      reject("Book unavailable by ISBN number");
    }
  })

  myPromise.then(
    (successMessage) => { return res.send(successMessage); },
    (failedMessage) => { return res.status(300).json({ message: failedMessage }); }
  );

});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  let myPromise = new Promise((resolve, reject) => {

    let allAuthors = [];
    let bookList = "";
    let i = 0;
    for (const [key, value] of Object.entries(books)) {
      if (value.author == req.params.author) {
        allAuthors[i] = JSON.stringify(books[key]["title"]);
        i++;
      }
    }
    if (i > 0) {
      allAuthors.forEach((currentVal) => bookList = bookList + currentVal + "<br/>");
      resolve(bookList);
    }
    else {
      reject("Book unavailable by Author name");
    }
  });
  myPromise.then(
    (successMessage) => { return res.send(successMessage); },
    (failedMessage) => { return res.status(300).json({ message: failedMessage }); }
  );
});

// Get all books based on title

public_users.get('/title/:title', function (req, res) {

  let myPromise = new Promise((resolve, reject) => {

    let allTitles = [];
    let bookList = "";
    let i = 0;
    for (const [key, value] of Object.entries(books)) {
      if (value.title == req.params.title) {
        allTitles[i] = JSON.stringify(books[key]["title"]);
        i++;
      }
    }
    if (i > 0) {
      allTitles.forEach((currentVal) => bookList = bookList + currentVal + "<br/>");
      resolve(bookList);
    }
    else {
      reject("Book unavailable by title");
    }
  });

  myPromise.then(
    (successMessage) => { return res.send(successMessage); },
    (failedMessage) => { return res.status(300).json({ message: "From Callback" + failedMessage }) });

  return;

});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  for (const [key, value] of Object.entries(books)) {
    if (key == req.params.isbn && books[key]["reviews"] != "{}") {
      return res.send(JSON.stringify(books[key]["reviews"]));
    }
  }
  return res.status(300).json({ message: "Book review unavailable" });
});

module.exports.general = public_users;
