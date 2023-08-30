const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');
// creating router
const router = express.Router({mergeParams : true});

router.get('/', async (req, res) =>{
   
    let limits = 25;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const publisherResult = await DB_publisher.getAllPublishers(offset,limits);
    //console.log(publisherResult);
    res.render('publisherLayout.ejs' , { data : publisherResult});
    
});

module.exports = router;