const express = require('express');
const DB_book = require('../Database/book-api');

// creating router
const router = express.Router({mergeParams : true});

router.get('/', async (req, res) =>{
   
    let limits = 25;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const booksResult = await DB_book.getAllBooks(offset,limits);
    console.log(booksResult.rows);
    //res.send(booksResult);
    res.render('layout.ejs' , { data : booksResult});
    
});

router.get('/count', async (req, res) =>{
   
    const booksResult = await DB_book.getAllBooksCount();
    res.send(booksResult);
    
});

module.exports = router;