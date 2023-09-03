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

module.exports = {
    getAllAuthors,
    getAuthorByAuthorID
}

