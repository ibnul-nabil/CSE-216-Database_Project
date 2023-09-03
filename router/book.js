const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');

// creating router
const router = express.Router({mergeParams : true});


// same code 
router.get('/author', async (req, res) =>{
    let limits = 90;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const authorResult = await DB_author.getAllAuthors(offset,limits);
    res.render('authors.ejs' , { data : authorResult});
});

router.get('/book', async (req, res) =>{
    let limits = 25;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const booksResult = await DB_book.getAllBooks(offset,limits);
    
    res.render('books.ejs' , { data : booksResult});
   
});

router.get('/publisher', async (req, res) =>{
    let limits = 100;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const publisherResult = await DB_publisher.getAllPublishers(offset,limits);
   
    res.render('publishers.ejs' , { data : publisherResult});
});
// same code 

router.get('/:bookID', async (req, res) =>{
    const bookID = parseInt(req.params.bookID,10);

    if (isNaN(bookID)) {
        // Handle the case where bookID is not a valid integer, e.g., redirect to an error page or return an error response.
        return res.status(400).send('Invalid book ID');
    }

    const bookResult = await DB_book.getBookByBookID(bookID);

    res.render('view-book.ejs' , {book : bookResult});
});

router.get('/bookSearch' , async (req, res)=>{
    const bookResult = await DB_book.searchBook(req.query.keyword);
    res.render('search-book.ejs' , {book : bookResult});
});
 
router.get('/', async (req, res) =>{
   
    let limits = 25;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const booksResult = await DB_book.getAllBooks(offset,limits);
    console.log(booksResult.rows);
    //res.send(booksResult);
    res.render('books.ejs' , { data : booksResult});
    
});



module.exports = router;