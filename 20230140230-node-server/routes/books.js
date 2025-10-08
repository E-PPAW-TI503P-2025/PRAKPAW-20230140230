	const express = require('express');
	const fs = require('fs');
	const path = require('path');
	const router = express.Router();

	const DATA_DIR = path.join(__dirname, '..', 'data');
	const DATA_FILE = path.join(DATA_DIR, 'books.json');

	function readBooks() {
	  try {
	    if (!fs.existsSync(DATA_FILE)) return [];
	    const raw = fs.readFileSync(DATA_FILE, 'utf8');
	    return JSON.parse(raw || '[]');
	  } catch (err) {
	    throw Object.assign(new Error('Failed to read books data'), { cause: err });
	  }
	}

	function writeBooks(books) {
	  try {
	    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
	    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2), 'utf8');
	  } catch (err) {
	    throw Object.assign(new Error('Failed to write books data'), { cause: err });
	  }
	}

	// Validation helper
	function validateBookPayload(payload) {
	  const errors = [];
	  if (!payload) errors.push('Payload is required');
	  else {
	    if (!payload.title || typeof payload.title !== 'string' || payload.title.trim() === '') errors.push('title is required and must be a non-empty string');
	    if (!payload.author || typeof payload.author !== 'string' || payload.author.trim() === '') errors.push('author is required and must be a non-empty string');
	    if (payload.year !== undefined && (typeof payload.year !== 'number' || !Number.isInteger(payload.year))) errors.push('year, if provided, must be an integer');
	  }
	  return errors;
	}

	// List all books
	router.get('/', (req, res, next) => {
	  try {
	    const books = readBooks();
	    res.json(books);
	  } catch (err) {
	    next(err);
	  }
	});

	// Get book by id
	router.get('/:id', (req, res, next) => {
	  try {
	    const id = parseInt(req.params.id);
	    const books = readBooks();
	    const book = books.find(b => b.id === id);
	    if (!book) return res.status(404).json({ message: 'Book not found' });
	    res.json(book);
	  } catch (err) {
	    next(err);
	  }
	});

	// Create new book
	router.post('/', (req, res, next) => {
	  try {
	    const payload = req.body;
	    const errors = validateBookPayload(payload);
	    if (errors.length) return res.status(400).json({ errors });
	
	    const books = readBooks();
	    const nextId = books.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
	    const book = {
	      id: nextId,
	      title: payload.title.trim(),
	      author: payload.author.trim(),
	      year: payload.year
	    };
	    books.push(book);
	    writeBooks(books);
	    res.status(201).json(book);
	  } catch (err) {
	    next(err);
	  }
	});

	// Update book
	router.put('/:id', (req, res, next) => {
	  try {
	    const id = parseInt(req.params.id);
	    const payload = req.body;
	    const errors = validateBookPayload(payload);
	    if (errors.length) return res.status(400).json({ errors });

	    const books = readBooks();
	    const idx = books.findIndex(b => b.id === id);
	    if (idx === -1) return res.status(404).json({ message: 'Book not found' });

	    const updated = Object.assign({}, books[idx], {
	      title: payload.title.trim(),
	      author: payload.author.trim(),
	      year: payload.year
	    });
	    books[idx] = updated;
	    writeBooks(books);
	    res.json(updated);
	  } catch (err) {
	    next(err);
	  }
	});

	// Partial update (patch)
	router.patch('/:id', (req, res, next) => {
	  try {
	    const id = parseInt(req.params.id);
	    const payload = req.body;
	    // For PATCH allow partial but validate types if present
	    const partial = {};
	    if (payload.title !== undefined) {
	      if (typeof payload.title !== 'string' || payload.title.trim() === '') return res.status(400).json({ message: 'title must be a non-empty string' });
	      partial.title = payload.title.trim();
	    }
	    if (payload.author !== undefined) {
	      if (typeof payload.author !== 'string' || payload.author.trim() === '') return res.status(400).json({ message: 'author must be a non-empty string' });
	      partial.author = payload.author.trim();
	    }
	    if (payload.year !== undefined) {
	      if (typeof payload.year !== 'number' || !Number.isInteger(payload.year)) return res.status(400).json({ message: 'year must be an integer' });
	      partial.year = payload.year;
	    }

	    const books = readBooks();
	    const idx = books.findIndex(b => b.id === id);
	    if (idx === -1) return res.status(404).json({ message: 'Book not found' });

	    const updated = Object.assign({}, books[idx], partial);
	    books[idx] = updated;
	    writeBooks(books);
	    res.json(updated);
	  } catch (err) {
	    next(err);
	  }
	});

	// Delete book
	router.delete('/:id', (req, res, next) => {
	  try {
	    const id = parseInt(req.params.id);
	    const books = readBooks();
	    const idx = books.findIndex(b => b.id === id);
	    if (idx === -1) return res.status(404).json({ message: 'Book not found' });
	    const removed = books.splice(idx, 1)[0];
	    writeBooks(books);
	    res.json({ message: 'Deleted', book: removed });
	  } catch (err) {
	    next(err);
	  }
	});

	module.exports = router;
