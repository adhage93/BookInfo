const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signUp')
        .get((req,res) => {
            res.render('signUp', {
                nav,
                title: 'Sign Up'
            });
        })
        .post((req,res) => {
            const { name, email, username, password, phone, profession } = req.body;
            const url = "mongodb://localhost:27017";
            const dbName = "libraryApp";

            (async function addUser(){
                let client;
                try 
                {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to Server');
                    
                    const db = client.db(dbName);
                    
                    const col = db.collection('users');
                    const user = { name, email, username, password, phone, profession };
                    const results = await col.insertOne(user);
                    debug(results);

                    req.login(results.ops[0], () => {
                        debug("User Signed Up succsessfully..."+JSON.stringify(results.ops[0]));
                        res.redirect('/auth/profile');
                    });
                } 
                catch (err) 
                {
                    debug(err);
                }
            }());
       });

    authRouter.route('/signIn')
       .get((req,res) => {
            res.render('signIn', {
                nav,
                title: 'Sign In'
            });
       })
       .post(passport.authenticate('local',{
           successRedirect: "/books",
           failureRedirect: "/"
       }));

    authRouter.route('/profile')
       .all((req,res,next) => {
            if(req.user) {
                next();
            }
            else
            {   
                res.redirect('/');
            }
        })
        .get((req,res) => {
            let user = req.user;
            res.render('profile', {
                nav,
                title: 'Profile',
                user
            });
        });

    authRouter.route('/logout')
        .all((req,res,next) => {
            if(req.user) {
                next();
            }
            else
            {   
                debug("No user logged in...");
                res.redirect('/');
            }
        })
        .get((req,res) => {
            debug("logged out successful for user: "+JSON.stringify(req.user));    
            req.logout()
            res.redirect('/');
        });
    
    return authRouter;
};

module.exports = router;