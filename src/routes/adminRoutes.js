const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

function router(nav)
{
    adminRouter.route('/')
        .get((req,res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';
            (async function mongo() {
                let client;
                try{
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to server');
                    const db = client.db(dbName);
                    const response = await db.collection("books").insertMany(books);
                    res.json(response).p;
                }
                catch(err)
                {
                    debug(err.stack);
                }
            }());
        });

    return adminRouter;
}

module.exports = router;