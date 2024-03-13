const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  
  bookList = '';
  for (const [key, value] of Object.entries(books)) {
    bookList = bookList + value.title;
  }
  return res.send(JSON.stringify(books));

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Task 2
  for(const [key,value] of Object.entries(books))
  {
    if(key==req.params.isbn)
    {
      return res.send(JSON.stringify(books[key]));
    }
  }
  return res.status(300).json({message: "Book unavailable by ISBN number"});

});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  let allAuthors = [];
  let bookList = "";
  let i = 0;
  let modedBook;
  for (const [key, value] of Object.entries(books)) {
    if (value.author == req.params.author) {
      modedBook=Object.assign({},books[key]);
      modedBook["isbn"]=key;
      delete modedBook.author;
      allAuthors[i] = JSON.stringify(modedBook);
      i++;
    }
  }
  if (i > 0) {
    allAuthors.forEach((currentVal) => bookList = bookList + currentVal);
    return res.send(bookList);
  }
  else {
    return res.status(300).json({ message: "Book unavailable by Author name" });
  }

});

// Get all books based on title
//Task 4
public_users.get('/title/:title', function (req, res) {
    let allTitles = [];
    let bookList = "";
    let modedBook;
    let i = 0;
    for (const [key, value] of Object.entries(books)) {
      if (value.title == req.params.title) {
        modedBook=Object.assign({},books[key]);
        modedBook["isbn"]=key;
        delete modedBook.title;
        allTitles[i] = JSON.stringify(modedBook);
        i++;
      }
    }
    if (i > 0) {
      allTitles.forEach((currentVal) => bookList = bookList + currentVal);
      return res.send(bookList);
    }
    else {
      return res.status(300).json({ message: "Book unavailable by title" });
    }

});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  for (const [key, value] of Object.entries(books)) {
    if (key == req.params.isbn && books[key]["reviews"] != "{}") {
      return res.send(JSON.stringify(books[key]["reviews"]));
    }
  }
  return res.status(300).json({ message: "Book review unavailable" });
});

module.exports.general = public_users;
