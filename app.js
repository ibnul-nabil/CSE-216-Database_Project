//libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const bookRouter = require('./router/book');
const authorRouter = require('./router/author');
const publisherRouter = require('./router/publisher');
const user_signupRouter = require('./router/user-signup')
const user_loginRouter = require('./router/user-login');
const user_infoRouter = require('./router/user-info');
const publisher_loginRouter = require('./router/publisher-login');
const DB_book = require('./Database/book-api');
const DB_publisher = require('./Database/publisher-api');
const DB_cart = require('./Database/cart-api');
const DB_order = require('./Database/order-api');

const DB_auth = require('./Database/auth-api');
const auth = require('./middlewares/auth').auth;
const session = require('express-session');
const { Console } = require('console');
//app creation
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan('tiny'));

// setting ejs to be view engine
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
  res.render('intro.ejs');
})


app.get('/bookSearch' , async (req, res)=>{
  const bookResult = await DB_book.searchBook(req.query.keyword);
  res.render('search-book.ejs' , {book : bookResult});
})


app.get('/publisher-allBooks/:publisherID' , async (req, res)=>{
  
  const publisherID = parseInt(req.params.publisherID,10);
  

  if (isNaN(publisherID)) {
      // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
      return res.status(400).send('Invalid author ID');
  }

  const publisherResult = await DB_publisher.getPublisher(publisherID);
  const publisherBooksResult = await DB_publisher.getAllBooks(publisherID);

  res.render('publisher-allBooks.ejs', {books : publisherBooksResult , publisher : publisherResult});
})

app.post('/publisher-allBooks/:publisherID' , async (req, res)=>{
  

  const bookID = parseInt(req.body.id, 10);
  const newPrice = parseInt(req.body.price, 10);
  const newStock = parseInt(req.body.stock, 10);
  
  const update =  await DB_book.updateBookByPublisher(bookID, newPrice, newStock);

  const publisherID = parseInt(req.params.publisherID,10);
  

  if (isNaN(publisherID)) {
      // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
      return res.status(400).send('Invalid author ID');
  }

  const publisherResult = await DB_publisher.getPublisher(publisherID);
  const publisherBooksResult = await DB_publisher.getAllBooks(publisherID);

  res.render('publisher-allBooks.ejs', {books : publisherBooksResult , publisher : publisherResult});
})

app.get('/publisher-allBooks/publisher-home/:publisherID' , async (req, res)=>{
  
  const publisherID = parseInt(req.params.publisherID,10);
  
  if (isNaN(publisherID)) {
      // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
      return res.status(400).send('Invalid author ID');
  }

  const publisherResult = await DB_publisher.getPublisher(publisherID);
  
  
  res.render('publisher-home.ejs', { publisher : publisherResult});
})

app.get('/orders/:publisherID' , async(req, res)=>{
  const publisherID = parseInt(req.params.publisherID,10);
  

  if (isNaN(publisherID)) {
      // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
      return res.status(400).send('Invalid author ID');
  }
  const orderResult = await DB_order.getOrderPublisherSide(publisherID);
   
  console.log(orderResult.rows);
  res.render('orders.ejs' , { list : orderResult.rows });
}) 

app.get('/cart/:customer_id' , async(req, res)=>{
  const customerID = parseInt(req.params.customer_id ,10);
  console.log(customerID);
  if (isNaN(customerID)) {
    // Handle the case where publisherID is not a valid integer, e.g., redirect to an error page or return an error response.
    return res.status(400).send('Invalid author ID');
  }
  const cartID = await DB_cart.getRecentCart(customerID);
  const cartBooks = await DB_cart.getBooksFromCart(customerID);
  const totalPriceandItem = await DB_cart.getTotalPriceAndItem(customerID);
  //console.log(cartBooks);
 
  
  res.render('cart.ejs' , {books : cartBooks , total : totalPriceandItem , cart : cartID });
})
app.post('/nabil' , async(req, res)=>{
  
  console.log(req.body);
  const cartID = parseInt(req.body.cartID);
  const discount =req.body.discountName;
  const  totalPrice = parseInt(req.body.totalPrice);
  const totalItem = parseInt(req.body.totalItem);

  const cid  = await DB_cart.getCustomerFromCartID(cartID);
  const discount_id = await DB_cart.getDiscountID(discount);

  const customer_id = (cid.rows[0].CUSTOMER_ID);
  const dis_id = (discount_id.rows[0].DISCOUNT_ID);
  const order = await DB_order.createOrderFromCart( customer_id,dis_id );
  
  
  
})

//does not work
app.post('/cart/remove' , async(req, res)=>{
  console.log('remove');
 
  const cid = parseInt(req.body.key1, 10);
  const bid = parseInt(req.body.key2, 10);
  const removeBooks = await DB_cart.deleteItemFromCart(cid, bid);
  const cartBooks = await DB_cart.getBooksFromCart(cid);
  
  //console.log(cartBooks);
 
  
  res.render('cart.ejs' , {books : cartBooks});
})

app.use('/book' , bookRouter);
app.use('/author' , authorRouter);
app.use('/publisher' , publisherRouter);
app.use('/user-signup', user_signupRouter);
app.use('/user-login', user_loginRouter);
app.use('/publisher-login', publisher_loginRouter);
app.use('/user-info',user_infoRouter);


app.use(session({
  secret :'secret',
  resave : false,
  saveUninitialized : false

}))
//app.use(auth);
// allow public directory
app.use(express.static('./public'));


module.exports = app;