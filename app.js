//libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const bookRouter = require('./router/book');
const authorRouter = require('./router/author');
const publisherRouter = require('./router/publisher');
const DB_book = require('./Database/book-api');
//app creation
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan('tiny'));

// setting ejs to be view engine
app.set('view engine', 'ejs');

app.get('/' , async (req, res)=>{
  
  res.render('home2.ejs');
})


app.get('/bookSearch' , async (req, res)=>{
  const bookResult = await DB_book.searchBook(req.query.keyword);
  res.render('search-book.ejs' , {book : bookResult});
})

app.use('/book' , bookRouter);
app.use('/author' , authorRouter);
app.use('/publisher' , publisherRouter);
// allow public directory
app.use(express.static('./public'));


module.exports = app;