const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');
// creating router
const router = express.Router({mergeParams : true});


// same code 
router.get('/author', async (req, res) =>{
    res.redirect('/author');
});

router.get('/book', async (req, res) =>{
    res.redirect('/book');
   
});

router.get('/publisher', async (req, res) =>{
    res.redirect('/publisher');
});

//  same code 

router.get('/:publisherID', async (req, res) =>{
    const publisherID = parseInt(req.params.publisherID,10);

    if (isNaN(publisherID)) {
        // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
        return res.status(400).send('Invalid author ID');
    }

    const publisherResult = await DB_publisher.getPublisher(publisherID);
    const publisherBooksResult = await DB_publisher.getAllBooks(publisherID);
    const totalBookCount = await DB_publisher.getBookCountByPublisher(publisherID);
    
    res.render('view-publisher.ejs' , {publisher : publisherResult , books : publisherBooksResult , count : totalBookCount});
});

router.get('/bookSearch' , async (req, res)=>{
    const bookResult = await DB_book.searchBook(req.query.keyword);
    res.render('search-book.ejs' , {book : bookResult});
});

router.get('/', async (req, res) =>{
   
    let limits = 100;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const publisherResult = await DB_publisher.getAllPublishers(offset,limits);
   
    res.render('publishers.ejs' , { data : publisherResult});
    
});

module.exports = router;