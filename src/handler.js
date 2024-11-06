const { nanoid } = require('nanoid');
const books = require('./books')

/**
 * Metode penambahan buku kepada database.
 * @param {Object} request - Request body yang mengandung data buku pada payload.
 * @param {Object} request.payload - Request payload yang mengandung data-data object buku.
 * @param {string} request.payload.name - Nama buku.
 * @param {number} request.payload.year - Tahun terbit buku.
 * @param {string} request.payload.author - Penulis buku.
 * @param {string} request.payload.summary - Summary buku.
 * @param {string} request.payload.publisher - Penerbit buku.
 * @param {number} request.payload.pageCount - Angka halaman buku.
 * @param {number} request.payload.readPage - Angka halaman yang sudah dibaca.
 * @param {boolean} request.payload.reading - Status pembacaan.
 * 
 * @param {Object} h - Respons toolkit HAPI.
 * 
 * @returns {Object} - Respons Data Buku dan Status.
 */
const insertBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount == readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

/**
 * Metode mengambil semua buku yang terdapat pada database dengan parameter opsional.
 * @param {Object} request - Request parameter yang mengandung data buku opsional.
 * @param {Object} request.params - Request parameter dari URL yang mengandung searchingopsional.
 * @param {Object} request.params.name - Searching opsional nama buku.
 * @param {Object} request.params.reading - Searching opsional status pembacaan buku.
 * @param {Object} request.params.finished - Searching opsional status pembacaan buku.

 * @param {Object} h - Respons toolkit HAPI.
 * 
 * @returns {Object} - Respons berisi status dan data buku: `id`, `name`, dan `publisher`.
 */
const getBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let searchFilter = books;

    if (name) {
        searchFilter = searchFilter.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (reading) {
        searchFilter = searchFilter.filter(book => book.reading === (reading == '1'));
    }

    if (finished) {
        searchFilter = searchFilter.filter(book => book.finished === (finished == '1'));
    }
    
    const filteredBooks = searchFilter.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks,
        },
    });
};

/**
 * Metode mendapatkan buku yang spesifik menggunakan bookId.
 *
 * @param {Object} request - Request body yang mengandung parameter untuk ID.
 * @param {Object} request.params - Request parameter dari URL yang mengandung `{bookId}`.
 * @param {string} request.params.bookId - ID buku.
 * 
 * @param {Object} h - Respons toolkit HAPI.
 * 
 * @returns {Object} - Respons berisi status dan data buku jika ditemukan.
 */
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find(book => book.id == bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book,
        },
    });
};

/**
 * Metode memperbarui data buku pada database.
 *
 * @param {Object} request - Request body yang mengandung data buku pada payload dan parameter untuk ID.
 * @param {Object} request.params - Request parameter dari URL yang mengandung `{bookId}`.
 * @param {string} request.params.bookId - ID buku.
 * @param {Object} request.payload - Request payload yang mengandung data-data object buku.
 * @param {string} request.payload.name - Nama buku.
 * @param {number} request.payload.year - Tahun terbit buku.
 * @param {string} request.payload.author - Penulis buku.
 * @param {string} request.payload.summary - Summary buku.
 * @param {string} request.payload.publisher - Penerbit buku.
 * @param {number} request.payload.pageCount - Angka halaman buku.
 * @param {number} request.payload.readPage - Angka halaman yang sudah dibaca.
 * @param {boolean} request.payload.reading - Status pembacaan.
 * 
 * @param {Object} h - Respons toolkit HAPI.
 * 
 * @returns {Object} - Respons Data Buku jika berhasil dan Status.
 */
const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const bookIndex = books.findIndex(book => book.id == bookId);

    if (bookIndex == -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    books[bookIndex].name = name;
    books[bookIndex].year = year;
    books[bookIndex].author = author;
    books[bookIndex].summary = summary;
    books[bookIndex].publisher = publisher;
    books[bookIndex].pageCount = pageCount;
    books[bookIndex].readPage = readPage;
    books[bookIndex].reading = reading;
    books[bookIndex].finished = (pageCount == readPage);
    books[bookIndex].updatedAt = new Date().toISOString();

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
};

/**
 * Metode penghapusan buku pada database.
 *
 * @param {Object} request - Request body yang mengandung parameter untuk ID.
 * @param {Object} request.params - Request parameter dari URL yang mengandung `{bookId}`.
 * @param {string} request.params.bookId - ID buku.
 * 
 * @param {Object} h - Respons toolkit HAPI.
 * 
 * @returns {Object} - Respons Berhasil/Gagal dan Status.
 */
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex(book => book.id == bookId);

  if (index != -1) {
    books.splice(index, 1);
    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
  }
    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
    insertBookHandler,
    getBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
