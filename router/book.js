const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');
const DB_cart = require('../Database/cart-api')

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

router.post('/addtocart' , async(req, res)=>{
    const cid = parseInt(req.body.key1, 10);
    const bid = parseInt(req.body.key2, 10); 
    const addcart = await DB_cart.addToCart(cid , bid);
    console.log(cid + ' ' + bid);
    res.redirect('/');
})

router.get('/bookSearch' , async (req, res)=>{
    const bookResult = await DB_book.searchBook(req.query.keyword);
    res.render('search-book.ejs' , {book : bookResult});
});
 
router.get('/', async (req, res) =>{
   
    let limits = 2000;
    let offsetPage = 1;
    if( req.query.page ) offsetPage = req.query.page;
    let offset = (offsetPage-1)*limits;
    const booksResult = await DB_book.getAllBooks(offset,limits);
    console.log(booksResult.rows);
    //res.send(booksResult);
    res.render('books.ejs' , { data : booksResult});
    
});



module.exports = router;