const express = require('express');
const bcrypt = require('bcrypt');

const DB_auth = require('../Database/auth-api');
const DB_cart = require('../Database/cart-api');
const authUtils = require('../utils/auth-utils');

// creating router
const router = express.Router({mergeParams : true});


router.get('/' , async (req, res)=>{
  
    res.render('user-signup.ejs');
})
  
router.post('/' , async (req, res)=>{
    
    // check if already logged in
    if(req.user == null){
        let results, errors = [];


        // check if email is alredy used or not
        console.log(req.body);
        results = await DB_auth.getUserIDByEmail(req.body.email);
        //console.log('result is ' + results);

        if(results.length > 0)
            errors.push('Email is already registered to a user');

        // check if password confimation is right
        // if(req.body.password !== req.body.password2)
        //     errors.push('Password confirmation doesn\'t match with password');

        // check if password has at least 6 char
        if(req.body.password.length < 6){
            errors.push('Password must be at least 6 characters');
        }


        // if there are errors, redirect to sign up but with form informations
        if(errors.length > 0){
            res.render('user-signup.ejs');
        }
        else{
            // if no error, create user object to be sent to database api
            let user = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                phone_no: req.body.phone_no,
                address: req.body.address
            }
            // hash user password
            await bcrypt.hash(user.password, 8, async (err, hash) =>{
                if(err)
                    console.log("ERROR at hashing password: " + err.message);
                else{
                    // create user via db-api, id is returned
                    user.password = hash;
                    let result = await DB_auth.createNewUser(user);
                    let result2 = await DB_auth.getLoginInfoByEmail(user.email);
                    // login the user too
                    await DB_cart.addNewCart(result2[0].CUSTOMER_ID);
                    await authUtils.loginUser(res, result2[0].CUSTOMER_ID);
                    // redirect to home page
                    //res.redirect(`/profile/${user.handle}/settings`);
                    res.redirect('/user-login');
                }
            });
        }
    } else {
        res.redirect('user-signup.ejs');
    }   
})

router.get('/user-login' , async (req, res)=>{
  
    res.render('user-login.ejs');
})

module.exports = router;