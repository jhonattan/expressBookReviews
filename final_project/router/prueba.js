let books = require("./booksdb.js");

var size = Object.keys(books[1]['reviews']).length;
let cont=0;
let reviewBody = "review3";
let username= "user3";
var review = {[username]: reviewBody};

console.log(review);

  Object.assign(books[1]['reviews'], review);
  console.log((JSON.stringify(books[1],null,4)));

  let username2= "user4";
  reviewBody = "review4";

  console.log(books[1]['reviews'][username2]==null);
  books[1]['reviews'][username2] = reviewBody;

  console.log((JSON.stringify(books[1],null,4)));