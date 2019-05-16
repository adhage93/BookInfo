const axios = require("axios");
const xml2js = require("xml2js");
const debug = require('debug')('app:goodreadService');

const parser = xml2js.Parser({ explicitArray : false });

function goodreadService() 
{
    function getBookById(isbn)
    {
        return new Promise((resolve, reject) => {
            const url = `https://www.goodreads.com/book/isbn/${isbn}?key=4melVAkaz6HjbYorhxN6LA`;
            debug("###"+url);
            axios.get(url)
            .then((response) => {
                parser.parseString(response.data, (err, result) => {
                    if(err)
                    {
                        debug(err);
                    }
                    else
                    {
                        debug(result);
                        resolve(result.GoodreadsResponse.book);
                    }
                });
            })
            .catch((error) => {
                reject(error);
                debug(error);
            });
        });
    }

    return { getBookById }
}

module.exports = goodreadService();