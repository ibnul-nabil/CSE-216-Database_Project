const database = require('./database');


// function to get id from email
async function createOrderFromCart(userId,discountId){

    const sql = `
        BEGIN
            rokomari.CREATE_ORDER(:userId,:discountID);
        END;
    `
    const binds = {
        userId,discountId
    }
    await database.execute(sql, binds, database.options);
    return ;
}

async function getOrderPublisherSide(publisherID){

    const sql = `
    SELECT b.BOOK_NAME , b.ISBN, b.EDITION, b.IMAGE,b.STOCK ,b.PRICE ,a.AUTHOR_ID , a.AUTHOR_NAME , c.NAME , c.EMAIL , c.PHONE_NO , c.ADDRESS 
    FROM ROKOMARI.ORDER_TABLE ot JOIN ROKOMARI.PICKED p
    ON ot.CART_ID = p.CART_ID 
    JOIN ROKOMARI.BOOK b 
    ON b.BOOK_ID =p.BOOK_ID 
    JOIN ROKOMARI.AUTHOR a 
    ON b.AUTHOR_ID = a.AUTHOR_ID 
    JOIN ROKOMARI.CUSTOMER c 
    ON c.CUSTOMER_ID = ot.CUSTOMER_ID 
    WHERE b.PUBLISHER_ID = : publisherID
    ORDER BY ot.CUSTOMER_ID 
        
    `
    const binds = {
        publisherID : publisherID
    }
    
    return await database.execute(sql, binds, database.options);
}



module.exports = {
    
    createOrderFromCart,
    getOrderPublisherSide
    

}