const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid


  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
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

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const reviewBody = req.body.review;
  const isbn = req.params.isbn;
  let bandera = false;
  let username = req.session.authorization['username'];
  var size = Object.keys(books[isbn]['reviews']).length;
  let cont=0;

  var review = {[username]: reviewBody};

  if (size === 0) {

    Object.assign(books[isbn]['reviews'], review);

  } else {
  
      if (books[isbn]['reviews'][username] != null) {
        books[isbn]['reviews'][username] = reviewBody;
        bandera = true;
      }
    
    if ((size > 0) && !bandera) {
      Object.assign(books[isbn]['reviews'], review);
    }

  }
  res.send(JSON.stringify(books, null, 4));
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  let username = req.session.authorization['username'];

  if (isbn) {
      // Delete friend from 'friends' object based on provided email
      delete books[isbn]['reviews'][username];
  }

  res.send(JSON.stringify(books, null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
