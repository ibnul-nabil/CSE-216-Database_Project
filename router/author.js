const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
// creating router
const router = express.Router({mergeParams : true});

router.get('/', async (req, res) =>{
   
    let limits = 100;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const authorResult = await DB_author.getAllAuthors(offset,limits);
    //console.log(authorResult);
    res.render('authorLayout.ejs' , { data : authorResult});
    
});

module.exports = router;