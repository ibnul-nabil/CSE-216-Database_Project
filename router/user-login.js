const express = require('express');
const bcrypt = require('bcrypt');

const DB_auth = require('../Database/auth-api');
const authUtils = require('../utils/auth-utils');
const DB_book = require('../Database/book-api');
const DB_author = require('../Database/author-api');

// creating router
const router = express.Router({mergeParams : true});


router.get('/' , async (req, res)=>{
  
    res.render('user-login.ejs');
})
  
router.post('/' , async (req, res)=>{
    
        // if not logged in take perform the post
        if(req.user == null){
            let results, errors = [];
            // get login info for handle (id, handle, password)
            results = await DB_auth.getLoginInfoByEmail(req.body.email);
            console.log(results);
            
            
            // if no result, there is no such user
            if(results.length == 0){
                errors.push('No such user found');
            } else {
                // match passwords
                const match = await bcrypt.compare(req.body.password, results[0].PASSWORD);
                if(match){
                    // if successful login the user
                    await authUtils.loginUser(res, results[0].ID);
                }
                else{
                    errors.push('wrong password');
                }
            }
    
            // if any error, redirect to login page but with form information, else redirect to homepage
            if(errors.length == 0){

                const jafor  = await DB_author.getAllBooksByAuthorName('মুহম্মদ জাফর ইকবাল');
                const humayun = await DB_author.getAllBooksByAuthorName('হুমায়ূন আহমেদ');
                const best = await DB_book.bestRated();
                res.render('home2.ejs',{customer : results , jafor : jafor , humayun : humayun , best :best});
                
            } else {
                res.render('user-login.ejs');
            }
        } else {
            res.render('user-login.ejs');
        }   
})


module.exports = router;