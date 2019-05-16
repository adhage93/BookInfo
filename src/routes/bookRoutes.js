const express = require('express');
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controller/bookController')
const bookService = require("../services/goodreadService");

const bookRouter = express.Router();

function router(nav) {

    const { getIndex, getById, getByTitle, middleware } = bookController(bookService, nav);

    bookRouter.use(middleware);
    
    bookRouter.route('/')
        .get(getIndex);

    bookRouter.route('/:isbn')
        .get(getById);

    bookRouter.route('/:title')
        .get(getByTitle);

    return bookRouter;
}

module.exports = router;
