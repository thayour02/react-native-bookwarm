import express from 'express';

import { createBook,getAllBooks,deleteBook,getBookbyUser } from '../controller/books.js';
import { authMiddleware } from '../middleware/authMidddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBook);

router.get("/", authMiddleware, getAllBooks);
router.get("/user", authMiddleware, getBookbyUser);
router.delete("/delete-book/:id", authMiddleware, deleteBook);

export default router;