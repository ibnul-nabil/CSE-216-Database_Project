const database = require('./database');



// function to get id from email
async function getUserByID(ID){
    const sql = `
        SELECT 
            CUSTOMER_ID,
            name,
            email,
            phone_no,
            address
        FROM 
            ROKOMARI.CUSTOMER
        WHERE 
            customer_id = :id
        `;
    
    const binds = {
        id : ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getUserIDByEmail(email){
    const sql = `
        SELECT 
            CUSTOMER_ID
        FROM 
            ROKOMARI.CUSTOMER
        WHERE 
            EMAIL = :email
        `;
    const binds = {
        email : email
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

// function to creat new user
// user should have handle, email, pass
// {id} will be returned
async function createNewUser(user){
    const sql = `
        INSERT INTO
            ROKOMARI.CUSTOMER(NAME,EMAIL, PASSWORD,PHONE_NO,ADDRESS)
        VALUES 
            (:name,:email,:password, :phone_no ,:address)
    `;
    const binds = {
        name: user.name,
        email :user.email,
        password: user.password,
        phone_no : user.phone_no,
        address: user.address,
    }
    return await database.execute(sql, binds, {});
}

// return login info (id, handle, password) from handle
async function getLoginInfoByEmail(email){
    const sql = `
        SELECT 
            CUSTOMER_ID,
            NAME,
            PASSWORD
        FROM
            ROKOMARI.CUSTOMER
        WHERE
            EMAIL = :email
    `;
    const binds = {
        email: email
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getLoginInfoByID(id){
    const sql = `
        SELECT 
            CUSTOMER_ID,
            NAME,
            PASSWORD,
            EMAIL,

        FROM
            ROKOMARI.CUSTOMER
        WHERE
            ID = :id
    `;
    const binds = {
        id: id
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getPublisherLoginInfoByName(name){
    const sql = `
        SELECT 
            
            PUBLISHER_NAME,
            PASSWORD
        

        FROM
            ROKOMARI.PUBLISHER
        WHERE
            PUBLISHER_NAME = :name
    `;
    const binds = {
        name: name
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

module.exports = {
    getUserByID,
    getUserIDByEmail,
    createNewUser,
    getLoginInfoByEmail,
    getLoginInfoByID,
    getPublisherLoginInfoByName
}