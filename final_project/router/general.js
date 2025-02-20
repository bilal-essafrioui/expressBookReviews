const express = require("express");
const axios = require("axios"); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  let registeringUser = req.body;
  if (!registeringUser.username || !registeringUser.password)
    return res.status(400).json({ error: "Username or Password are empty" });

  for (let user of users) {
    if (registeringUser.username === user.username)
      return res.status(409).json({ error: "Username already taken" });
  }
  
  users.push(registeringUser);
  return res.status(200).json({ message: "User registered successfully!" });
});

// Task 10: Get the book list available in the shop (Async-Await)
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json({ books: response.data });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Task 11: Get book details based on ISBN (Async-Await)
public_users.get("/isbn/:isbn", async (req, res) => {
  let isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    return res.status(200).json({ searchedBook: response.data });
  } catch (error) {
    return res.status(404).json({ message: "No data found" });
  }
});

// Task 12: Get book details based on author (Using Promises)
public_users.get("/author/:author", (req, res) => {
  let author = req.params.author;
  
  axios.get("http://localhost:5000/books")
    .then((response) => {
      let searchedBooks = [];
      for (const isbn in response.data) {
        if (response.data[isbn].author === author)
          searchedBooks.push(response.data[isbn]);
      }
      
      if (searchedBooks.length)
        return res.status(200).json({ searchedBooks: searchedBooks });
      return res.status(404).json({ message: "No books found for this author" });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failed to fetch books" });
    });
});

// Task 13: Get all books based on title (Using Promises)
public_users.get("/title/:title", (req, res) => {
  let title = req.params.title;
  
  axios.get("http://localhost:5000/books")
    .then((response) => {
      let searchedBook = null;
      for (const isbn in response.data) {
        if (response.data[isbn].title === title)
          searchedBook = response.data[isbn];
      }
      
      if (searchedBook)
        return res.status(200).json({ searchedBook: searchedBook });
      return res.status(404).json({ message: "No book found with this title" });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failed to fetch books" });
    });
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let searchedBook = books[isbn];

  if (searchedBook)
    return res.status(200).json({ reviews: searchedBook.reviews });
  return res.status(404).json({ message: "No data found" });
});

module.exports.general = public_users;


/*const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let user = req.body;
  if(user.username && user.password){
    is_exists = users.find(u => u.username == user.username && u.password == user.password);
    if(is_exists){
      res.status(409).json("user already exists");
    }
    users.push(user);
    res.json({message: "user has been registred"});
  }
  else{
    return res.status(400).json({message: "username and password are required !"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({books: JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  searchedBook = books[ISBN];
  if(searchedBook)
  return res.status(201).json({book: JSON.stringify(searchedBook)});
  return res.status(404).json({message: `No book found with ${ISBN}`});
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksByAuthor = [];

  for (let i in books) { // Itérer sur les clés de l'objet books
    let book = books[i]; // Récupérer le livre
    if (book.author === author) {
      booksByAuthor.push(book);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(201).json(booksByAuthor); // Retourner les livres trouvés
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  for (let ISBN in books){
    if(books[ISBN].title === title ){
      return res.status(201).json(books[ISBN]);
    }
  }
  return res.status(404).json({message: "NO data found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  if(books[ISBN])
  return res.status(200).json({reviews: books[ISBN].reviews});
  return res.status(300).json({message: "NO data found"});
});

module.exports.general = public_users;*/
