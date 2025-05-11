import express from 'express';

import { createBook,getAllBooks,deleteBook,getBookbyUser } from '../controller/books.js';
import { authMiddleware } from '../middleware/authMidddleware.js';

const router = express.Router();

router.post("/create-book", authMiddleware, createBook);

router.get("/get-all-books", authMiddleware, getAllBooks);
router.get("/get-book-by-user", authMiddleware, getBookbyUser);
router.delete("/delete-book/:id", authMiddleware, deleteBook);

export default router;