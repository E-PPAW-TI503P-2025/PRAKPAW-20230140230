	const express = require('express');
	const cors = require('cors'); 
	const path = require('path');
	const app = express();
	const PORT = process.env.PORT || 3001;
	const bookRoutes = require('./routes/books');

	// Logging middleware - must be registered early
	app.use((req, res, next) => {
	  const now = new Date().toISOString();
	  console.log(`${now} - ${req.method} ${req.originalUrl}`);
	  next();
	});

	// Built-in middleware
	app.use(cors());
	app.use(express.json());

	// API routes
	app.use('/api/books', bookRoutes);

	// Root
	app.get('/', (req, res) => {
	  res.send('Home Page for API');
	});

	// 404 handler
	app.use((req, res, next) => {
	  res.status(404).json({ error: 'Not Found' });
	});

	// Global error handler
	app.use((err, req, res, next) => {
	  console.error('Unhandled error:', err && err.stack ? err.stack : err);
	  const status = err && err.status ? err.status : 500;
	  res.status(status).json({ error: err && err.message ? err.message : 'Internal Server Error' });
	});

	app.listen(PORT, () => {
	  console.log(`Express server running at http://localhost:${PORT}/`);
	});

