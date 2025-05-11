

import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected successfully")
    } catch (error) {
        console.log(error, "error connecting to database")
    }
}