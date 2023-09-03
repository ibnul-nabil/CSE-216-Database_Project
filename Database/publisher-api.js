const database = require('./database');


async function getAllPublishers(offset,limit){
    console.log(offset,limit)
    const sql = `
        SELECT *
        FROM ROKOMARI.PUBLISHER 
        OFFSET :offset ROWS 
        FETCH NEXT :limit ROWS ONLY
        `;
    const binds = {
        offset,limit
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getPublisher(ID){
    const sql = `
        SELECT * 
        FROM ROKOMARI.PUBLISHER p 
        WHERE p.PUBLISHER_ID = :id 
 
    `;
    const binds = {
        id : ID
    }
    return (await database.execute(sql, binds, database.options)).rows;


}


async function getAllBooks(ID){
    const sql = `
        SELECT 
        b.BOOK_ID , b.BOOK_NAME , a.AUTHOR_NAME , b.PRICE , b.IMAGE , b.EDITION 
        FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
        ON b.AUTHOR_ID = a.AUTHOR_ID 
        WHERE b.PUBLISHER_ID = :id
    `;
    const binds = {
        id : ID
    }
    return (await database.execute(sql, binds, database.options)).rows;


}
async function getBookCountByPublisher(ID){
    const sql = `
        SELECT COUNT(b.BOOK_ID)  AS CNT  
        FROM ROKOMARI.BOOK b 
        WHERE b.PUBLISHER_ID =: id 
    `;
    const binds = {
        id : ID
    }
    return (await database.execute(sql, binds, database.options)).rows;


}

module.exports = {
    getAllPublishers,
    getPublisher,
    getAllBooks,
    getBookCountByPublisher,
    getAllBooks
}