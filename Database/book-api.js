const database = require('./database');

async function getAllBooks(offset,limit){
    
    const sql = `
        SELECT b.BOOK_ID, b.BOOK_NAME  , a.AUTHOR_NAME , p.PUBLISHER_NAME , b.PRICE , b.image 
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

async function getBookByBookID(ID){
    const sql = `
        SELECT 
            b.BOOK_ID,b.BOOK_NAME , a.AUTHOR_NAME , p.PUBLISHER_NAME ,
            b.PRICE , b.RATING , b.ISBN , b.IMAGE , b.PAGE , 
            b.EDITION , b.PUBLISHING_YEAR , b.LANGUAGE , b.REVIEW_CNT , b.SUMMARY,  
            g.NAME  
        FROM ROKOMARI.BOOK b LEFT OUTER JOIN ROKOMARI.AUTHOR a 
        ON b.AUTHOR_ID = a.AUTHOR_ID 
        LEFT JOIN ROKOMARI.PUBLISHER p 
        ON b.PUBLISHER_ID = p.PUBLISHER_ID 
        LEFT JOIN ROKOMARI.BOOK_GENRE bg 
        ON b.BOOK_ID = bg.BOOK_ID 
        LEFT JOIN ROKOMARI.GENRE g 
        ON bg.GENRE_ID = g.GENRE_ID 
        WHERE b.BOOK_ID = :id 
        `;
    const binds = {
        id:ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBookByAuthorID(ID){
    const sql = `
        SELECT 
            b.BOOK_ID , b.BOOK_NAME , p.PUBLISHER_NAME , b.PRICE , b.IMAGE 
        FROM ROKOMARI.BOOK b JOIN ROKOMARI.PUBLISHER p 
        ON b.PUBLISHER_ID = p.PUBLISHER_ID 
        WHERE b.AUTHOR_ID = :id
        `;
    const binds = {
        id:ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBookCountByAuthor(ID){
    const sql = `
        SELECT 
            count(b.BOOK_ID) AS CNT 
        FROM ROKOMARI.BOOK b 
        WHERE b.AUTHOR_ID = :id
        `;
    const binds = {
        id:ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}


async function searchBook(ID){
    const sql = `
    SELECT 
        b.BOOK_ID, b.BOOK_NAME , b.PRICE , b.IMAGE , b.GENRE ,
        a.AUTHOR_NAME , p.PUBLISHER_NAME 
        FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
            ON b.AUTHOR_ID = a.AUTHOR_ID 
        JOIN ROKOMARI.PUBLISHER p 
            ON b.PUBLISHER_ID = p.PUBLISHER_ID 
        WHERE (( LOWER(b.BOOK_NAME) LIKE '%'||LOWER(:id)||'%') OR
            ( LOWER(a.AUTHOR_NAME) LIKE '%'||LOWER(:id)||'%') OR 
            ( LOWER(p.PUBLISHER_NAME) LIKE '%'||LOWER(:id)||'%') OR
            ( LOWER(B.GENRE) LIKE '%'||LOWER(:id)||'%'))
        
        `;
    const binds = {
        id:ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function updateBookByPublisher(bookID , price , stock){
    const sql = `
    BEGIN
    rokomari.Book_update_check(:id,:price,:stock);
    END;
        
        `;
    const binds = {
        id : bookID,
        price: price,
        stock: stock
    }
    const updateResult = (await database.execute(sql, binds, database.options));
    return;
}


async function bestRated(){
    const sql = `
    SELECT b.BOOK_NAME , b.IMAGE , b.PRICE , b.GENRE, a.AUTHOR_NAME , p.PUBLISHER_NAME , b.BOOK_ID  , b.RATING 
    FROM ROKOMARI.BOOK b JOIN ROKOMARI.AUTHOR a 
    ON b.AUTHOR_ID = a.AUTHOR_ID 
    JOIN ROKOMARI.PUBLISHER p 
    ON p.PUBLISHER_ID = b.PUBLISHER_ID 
    ORDER BY b.RATING DESC
        
        `;
    const binds = {
        
    }
    
    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getAllBooks ,
    getAllBooksCount,
    getBookByBookID,
    getBookByAuthorID,
    getBookCountByAuthor,
    searchBook,
    updateBookByPublisher,
    bestRated
}