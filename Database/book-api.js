const database = require('./database');

async function getAllBooks(offset,limit){
    console.log(offset,limit)
    const sql = `
        SELECT b.BOOK_NAME  , a.AUTHOR_NAME , p.PUBLISHER_NAME , b.PRICE 
        FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
        ON b.AUTHOR_ID = a.AUTHOR_ID 
        JOIN ROKOMARI.PUBLISHER p
        ON b.PUBLISHER_ID = p.PUBLISHER_ID 
        OFFSET :offset ROWS 
        FETCH NEXT :limit ROWS ONLY
        `;
    const binds = {
        offset,limit
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getAllBooksCount(){
    const sql = `
        SELECT 
            COUNT(*) AS CNT
        FROM 
            rokomari.Book
        `;
    const binds = {
    }
    return (await database.execute(sql, binds, database.options)).rows;
}



module.exports = {
    getAllBooks ,
    getAllBooksCount
   
}