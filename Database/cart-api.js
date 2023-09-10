const database = require('./database');


// function to get id from email
async function getCustomerFromCartID(cartID){
    const sql = `
        SELECT CUSTOMER_ID FROM ROKOMARI.CART WHERE CART_ID = :cartID
   `;
    const binds = {
        cartID : cartID
    };
    
    return (await database.execute(sql, binds, database.options));
}

async function deleteItemFromCart(userId,bookId){
    const sql = `
        DELETE FROM rokomari.picked
        WHERE book_id = :bookId
        AND cart_id = (SELECT cart_id FROM rokomari.customer WHERE customer_id = :userId)
   `;
    const binds = {
        bookId:bookId,
        userId:userId
    };
    (await database.execute(sql, binds, database.options));
    return;
}

async function getCartByID(userID,cartID){
    const sql = `
    SELECT 
    *
    FROM 
    ROKOMARI.CART c
    WHERE c.CUSTOMER_ID  = :userID and c.CART_ID  = :cartID
        `;
    const binds = {
        id:cartID,
        userID:userID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getRecentCart(userID){
    const sql = `
        SELECT * FROM ROKOMARI.CART c  
        WHERE c.CUSTOMER_ID  = :userID
        ORDER BY c.CREATED_AT  DESC
    `
    const binds = {
        userID:userID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function addNewCart(userID){
    const sql = `
        INSERT INTO rokomari.cart(customer_id) VALUES(:userID)
    `;
    const binds = {
        userID:userID
    }
    await database.execute(sql, binds, database.options);
    const cartResult = await getRecentCart(userID);
    
    const cartID = cartResult[0].CART_ID;
    const sql2 = `
        UPDATE rokomari.customer SET cart_id = :cartID WHERE customer_id = :userID
    `
    const binds2 = {
        cartID:cartID,
        userID:userID
    };
    const updateResult = await database.execute(sql2, binds2, database.options)
    return;
}

async function addToCart(userID,bookID){
    const sql = `
        INSERT INTO ROKOMARI.PICKED p (cart_id,book_id)
        VALUES( (select cart_id from ROKOMARI.CUSTOMER c  WHERE c.CUSTOMER_ID  = :userID),:bookID )
    `;
    const binds = {
        userID:userID,
        bookID:bookID
    }
    const updateResult = await database.execute(sql, binds, database.options);
    return;
}


async function getTotalPrice(userID){
    const sql = `
        SELECT SUM(b.price*p.amount) AS PRICE FROM ROKOMARI.PICKED p 
        JOIN ROKOMARI.BOOK b  ON p.BOOK_ID = b.BOOK_ID 
        WHERE p.CART_ID  = ( SELECT cart_id FROM ROKOMARI.CUSTOMER WHERE CUSTOMER_ID = :userID)
    `;
    const binds = {
        userID : userID,
    }

    return (await database.execute(sql, binds, database.options)).rows;
}


async function getTotalPriceAndItem(userID){
    const sql = `
        SELECT SUM(b.price*p.AMOUNT) AS PRICE, SUM(p.AMOUNT) AS ITEM FROM ROKOMARI.PICKED p 
        JOIN ROKOMARI.BOOK b  ON p.BOOK_ID  = b.BOOK_ID 
        WHERE p.CART_ID  = ( SELECT cart_id FROM ROKOMARI.CUSTOMER WHERE CUSTOMER_ID = :userID)
    `;
    
    const binds = {
        userID : userID,
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBooksFromCart(userID){
    const sql = `
    SELECT b.BOOK_ID , b.BOOK_NAME , b.PRICE , b.RATING , b.IMAGE , a.AUTHOR_NAME , p.PUBLISHER_NAME 
    FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
    ON b.AUTHOR_ID  = a.AUTHOR_ID 
    JOIN ROKOMARI.PUBLISHER p
    ON b.PUBLISHER_ID = p.PUBLISHER_ID 
    WHERE b.BOOK_ID IN (SELECT p.BOOK_ID 
                        FROM ROKOMARI.PICKED p 	
                        WHERE p.CART_ID = (SELECT c.CART_ID 
                                            FROM ROKOMARI.CUSTOMER c 
                                            WHERE c.CUSTOMER_ID = :userID  ))
    
    `;
    const binds = {
        userID: userID
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getDiscountID(discountName){
    const sql = `
    SELECT DISCOUNT_ID FROM ROKOMARI.DISCOUNT d WHERE D.NAME = :dname
    
    `;
    const binds = {
        dname :discountName
    }

    return (await database.execute(sql, binds, database.options));
}


module.exports = {
    
    getCartByID,
    getRecentCart,
    addNewCart,
    addToCart,
    deleteItemFromCart, 
    getTotalPrice,
    getBooksFromCart,
    getTotalPriceAndItem,
    getCustomerFromCartID,
    getDiscountID
}