const express = require('express');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');
const DB_publisher = require('../Database/publisher-api');
const DB_auth = require('../Database/auth-api');
const { route } = require('./book');
// creating router
const router = express.Router({mergeParams : true});

//same code 
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
router.get('/:customerID', async (req,res)=>{
    const customerID = parseInt(req.params.customerID,10);
  
      if (isNaN(customerID)) {
          // Handle the case where bookID is not a valid integer, e.g., redirect to an error page or return an error response.
          return res.status(400).send('Invalid book ID');
      }
  
      const customerResult = await DB_auth.getUserByID(customerID);
    res.render('user-info.ejs' ,{ customer : customerResult});
})

router.get('/cart', async (req,res)=>{
    const customerID = parseInt(req.params.customerID,10);
  
      if (isNaN(customerID)) {
          // Handle the case where bookID is not a valid integer, e.g., redirect to an error page or return an error response.
          return res.status(400).send('Invalid book ID');
      }
  
      const customerResult = await DB_auth.getUserByID(customerID);
    res.render('user-info.ejs' ,{ customer : customerResult});
})

module.exports = router;