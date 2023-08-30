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

module.exports = {
    getAllPublishers
}