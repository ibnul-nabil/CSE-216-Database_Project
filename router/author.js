const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');
// creating router
const router = express.Router({mergeParams : true});



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

router.get('/:authorID', async (req, res) =>{
    const authorID = parseInt(req.params.authorID,10);

    if (isNaN(authorID)) {
        // Handle the case where authorID is not a valid integer, e.g., redirect to an error page or return an error response.
        return res.status(400).send('Invalid author ID');
    }

    const authorResult = await DB_author.getAuthorByAuthorID(authorID);
    const authorBooksResult = await DB_book.getBookByAuthorID(authorID);
    const totalBookCount = await DB_book.getBookCountByAuthor(authorID);
    
    res.render('view-author.ejs' , {author : authorResult , books : authorBooksResult , count : totalBookCount});
});
router.get('/bookSearch' , async (req, res)=>{
    const bookResult = await DB_book.searchBook(req.query.keyword);
    res.render('search-book.ejs' , {book : bookResult});
});
router.get('/', async (req, res) =>{

    let limits = 90;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const authorResult = await DB_author.getAllAuthors(offset,limits);
    //console.log(authorResult);
    res.render('authors.ejs' , { data : authorResult});
    
});




module.exports = router;