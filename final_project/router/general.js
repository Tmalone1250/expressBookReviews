const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"USer Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check username and password"})
  }  

 
});

public_users.post("/login", (req, res) => {
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

// // Get the book list available in the shop
// public_users.get('/',async (req, res) => {
//     await res.send(JSON.stringify(books,null,4));
   
//  });


// Get the book list available in the shop using async await
public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 1000);  // Move the closing parenthesis here
        });
    };

    getBooks()
        .then((books) => {
            res.json(books);
        })
        .catch((err) => {
            res.status(500).json({ error: "An error occurred" });
        });
});


// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',async (req, res)=>{
  
//   const ISBN = req.params.isbn;
//   await res.send(books[ISBN]);    
 
//  });
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
    const ISBN = req.params.isbn;
    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books.find((b) => b.isbn === ISBN); // Ensure you're using the right key here
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    booksBasedOnIsbn(ISBN) // Correct the typo here
        .then((book) => {
            res.json(book);
        })
        .catch((err) => {
            res.status(400).json({ error: "Book not found" });
        });
});
 
  //let new_books = {}
  //const new_author = req.params.author;
  //let i=1;
  //for(let bookid in books){
   //   if(books[bookid].author === new_author ){
    //    new_books[i++] = books[bookid];
    //  }
    //}
    //await res.send(JSON.stringify(new_books))
    public_users.get('/author/:author', (req, res) => {
        const author = req.params.author;
        const booksBasedOnAuthor = (auth) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const filteredbooks = books.filter((b) => b.author === auth);
                    if (filteredbooks.length > 0) {  // Use .length to check array length
                        resolve(filteredbooks);
                    } else {
                        reject(new Error("Book not found"));
                    }
                }, 1000);
            });
        };
    
        booksBasedOnAuthor(author)
            .then((book) => {
                res.json(book);
            })
            .catch((err) => {
                res.status(400).json({ error: "Book not found" });
            });
    });

// Get all books based on title
  
  //let new_books = {}
  //const re_title = req.params.title;
  //let i = 1;
  //for(bookid in books){
    //  if(books[bookid].title === re_title ){
      //  new_books[i++] = books[bookid]
      //}
  //}
  //await res.send(JSON.stringify(new_books))

  public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const filteredbooks = books.filter((b) => b.title === booktitle);
                if (filteredbooks.length > 0) {  // Use .length to check array length
                    resolve(filteredbooks);
                } else {
                    reject(new Error("Book not found"));
                }
            }, 1000);
        });
    };

    booksBasedOnTitle(title)
        .then((new_books) => {
            res.json(new_books);
        })
        .catch((err) => {
            res.status(400).json({ error: "Book not found" });
        });
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book && book.review) {
        res.send(JSON.stringify(book.review, null, 4));
    } else {
        res.status(404).json({ error: "Review not found for this ISBN" });
    }
});

module.exports.general = public_users;