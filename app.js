//libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bookRouter = require('./router/book');
const authorRouter = require('./router/author');
const publisherRouter = require('./router/publisher');

//app creation
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan('tiny'));

// setting ejs to be view engine
app.set('view engine', 'ejs');
app.get('/' , (req, res)=>{
  res.render('home.ejs');
})
app.use('/book' , bookRouter);
app.use('/author' , authorRouter);
app.use('/publisher' , publisherRouter);
// allow public directory
app.use(express.static('public'))

module.exports = app;