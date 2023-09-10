const express = require('express');
const bcrypt = require('bcrypt');

const DB_auth = require('../Database/auth-api');
const DB_publisher = require('../Database/publisher-api');
const authUtils = require('../utils/auth-utils');

// creating router
const router = express.Router({mergeParams : true});


router.get('/' , async (req, res)=>{
  
    res.render('publisher-login.ejs');
})
  
router.post('/' , async (req, res)=>{
        
        // if not logged in take perform the post
        if(req.user == null){
            let results, errors = [];
            // get login info for handle (id, handle, password)
            results = await DB_auth.getPublisherLoginInfoByName(req.body.name);
    
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
                const publisherResult = await DB_publisher.getPublisherByName(req.body.name);
                
                res.render('publisher-home.ejs', {publisher : publisherResult});
            } else {
                res.render('publisher-login.ejs');
            }
        } else {
            res.render('publisher-login.ejs');
        }   
        
})



module.exports = router;