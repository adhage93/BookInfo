const { MongoClient } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav)
{
    function getIndex(req, res) 
    {
        const user = req.user;
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');
                const db = client.db(dbName);
                const col = await db.collection("books");

                const books = await col.find().toArray()
                res.render(
                    'bookListView',
                    {
                        title: 'Library',
                        nav,
                        books,
                        user
                    });
            }
            catch (err) 
            {
                debug(err.stack);
            }
            client.close();
        }());
    };

    function getById(req, res)
    {
        let { isbn } = req.params;
        isbn = isbn.toString();
        
        const user = req.user;
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo(){

            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');
                const db = client.db(dbName);
                const col = await db.collection("books");
                const book = await col.findOne({ "isbn" : isbn });
                debug(book);

                let zero = "0";
                isbn = zero.concat(isbn)
                debug("@@@"+isbn);
                book.details = await bookService.getBookById(isbn);

                res.render(
                    'bookView',
                    {
                        title: 'Library',
                        nav,
                        book,
                        user
                    }
                );
            }
            catch (err)
            {
                debug(err.stack)
            }
        }());
    };

    function getByTitle(req, res)
    {
        let { title } = req.params;
        title = title.toString();
        let pattern = "/".concat(title).concat("/")
        debug(pattern);
        const user = req.user;
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo(){

            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');
                const db = client.db(dbName);
                const col = await db.collection("books");
                const books = await col.find({ "title" : {"$regex" : pattern} });
                debug(books);

                res.render(
                    'bookView',
                    {
                        title: 'Library',
                        nav,
                        books,
                        user
                    }
                );
            }
            catch (err)
            {
                debug(err.stack)
            }
        }());
    };

    function middleware(req,res,next) 
    {
        if(req.user) {
            next();
        }
        else
        {   
            res.redirect('/');
        }
    }

    return {
        getIndex,
        getById,
        getByTitle,
        middleware
    };
}

module.exports = bookController;