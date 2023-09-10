// libraries
const jwt = require('jsonwebtoken');

// my modules
const DB_auth = require('../Database/auth-api');

// function to login user into a session
async function loginUser(res, userId){
    // create token
    const payload = {
        id: userId
    };
    const secretKey = '3b$T9PjZ&Gv$Lm7#XkW@5A%2sR8rEhFq';
    let token = jwt.sign(payload, secretKey);
    //let token = jwt.sign(payload, process.env.APP_SECRET);
    // put token in db
    //await DB_auth.updateUserTokenById(userId, token);
    // set token in cookie
    let options = {
        maxAge: 90000000, 
        httpOnly: true
    }
    res.cookie('sessionToken', token, options);
}

async function loginPublisher(res, userId){
    // create token
    const payload = {
        superid: userId
    };
    const secretKey = '3b$T9PjZ&Gv$Lm7#XkW@5A%2sR8rEhFq';
    let token = jwt.sign(payload, secretKey);
    // put token in db
    //await DB_auth.updateUserTokenById(userId, token);
    // set token in cookie
    let options = {
        maxAge: 90000000,
        httpOnly: true
    }
    res.cookie('adminSessionToken', token, options);
}

module.exports = {
    loginUser,
    loginPublisher
}