const {
    insertBookHandler,
    getBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
} = require('./handler');
  
const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: insertBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
    },
];

module.exports = routes;