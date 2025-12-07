const database = require('./database');

async function getAllAuthors(offset,limit){
    console.log(offset,limit)
    const sql = `
        SELECT *
        FROM ROKOMARI.AUTHOR 
        OFFSET :offset ROWS 
        FETCH NEXT :limit ROWS ONLY
        `;
    const binds = {
        offset,limit
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getAuthorByAuthorID(ID){
    const sql =`
        SELECT *
        FROM ROKOMARI.AUTHOR 
        WHERE AUTHOR_ID = :id
        `;
    
    const binds = {
        id: ID
    }
    return (await database.execute(sql, binds , database.options)).rows;
} 

async function getAllBooksByAuthorName(name){
    const sql =`
    SELECT b.BOOK_ID , b.BOOK_NAME , b.IMAGE , b.PRICE , b.GENRE , p.PUBLISHER_NAME 
    FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
    ON b.AUTHOR_ID = a.AUTHOR_ID 
    JOIN ROKOMARI.PUBLISHER p 
    ON p.PUBLISHER_ID =b.PUBLISHER_ID 
    WHERE a.AUTHOR_NAME = :id
        `;
    
    const binds = {
        id: name
    }
    return (await database.execute(sql, binds , database.options)).rows;
} 



module.exports = {
    getAllAuthors,
    getAuthorByAuthorID,
    getAllBooksByAuthorName
}

