# Simple Library API (Express)

This is a small Express.js application that provides CRUD operations for managing library books.

Features:
- CRUD endpoints for books under `/api/books`
- Data persisted to `data/books.json` (simple JSON file storage)
- Logging middleware that logs timestamp, HTTP method, and URL
- 404 handler and global error handler
- Input validation for create/update operations

Run locally:

```powershell
# from the project folder (20230140230-node-server)
npm install
node server.js
# or with nodemon if installed:
# npx nodemon server.js
```

API examples:
- GET /api/books
- GET /api/books/1
- POST /api/books  { "title": "New Book", "author": "Someone", "year": 2024 }
- PUT /api/books/1   { "title": "Updated", "author": "Author", "year": 2025 }
- PATCH /api/books/1 { "title": "Partial" }
- DELETE /api/books/1

Notes:
- This project uses a JSON file for persistence and is intended for demo purposes only.
- The server listens on port 3001 by default.
