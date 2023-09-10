const database = require('./database');

async function getProfile(userId){
    const sql = `
        SELECT 
            *
        FROM 
            rokomari.customer
        WHERE 
            customer_id = :userId
        `;
    const binds = {
        userId:userId
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function updateProfile(id,name,phone, address ){
    const sql = `
        UPDATE rokomari.customer SET
        NAME = :name, PHONE_NO = :phone , ADDRESS = :address
        WHERE customer_id = :id
    `;
    const binds = {
        id:id,
        name:name,
        phone:phone,  
        address: address 
    }
    await database.execute(sql, binds, database.options);
    return;
}
module.exports = {
    getProfile,
    updateProfile
}