const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user."+req.body.username+"and"+ req.body.password });
});

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review", (req, res) => {

  let name = req.session.authorization.username;
  let isbnNumber = req.query.isbn;
  let newReview = req.query.review;
  let isISBNNumberValid = false;
  for (const [key, value] of Object.entries(books)) {
    if (isbnNumber == key) {
      isISBNNumberValid = true;
      break;
    }
    else {
      isISBNNumberValid=false;
    }
  }

  if (isISBNNumberValid = true) {
    console.log(JSON.stringify(users));
    console.log("userlength is " + users.length);
    for (let i = 0; i <= users.length - 1; i++) {
      if (users[i].username == name) {
        if (!(name in books[isbnNumber].reviews)) {
          books[isbnNumber].reviews[name] = newReview;
        }
        else {
          books[isbnNumber].reviews[name] = newReview;
        }
      }
    }
    console.log("done");
    return res.status(200).send("Review succesfully added");
  }
  else 
  {
    console.log("ISBN num not recognized");
    return res.status(300).json({ message: "ISBN num not recognized" });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
