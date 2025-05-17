import express from 'express';
// import { configDotenv } from 'dotenv';
import "dotenv/config";

import {connectDB} from './database/db.js';

import  authRoutes  from "./route/auth.js"
import bookRoutes from './route/books.js';
import cors from 'cors';
import job from './database/cron.js';

const app = express();
const PORT = process.env.PORT


job.start()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)



app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})