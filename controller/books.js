// import { cloudinary } from "../database/cloudinary";
import cloudinary from "../database/cloudinary.js";
import Book from "../model/books.js";


export const createBook = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        const userId = req.user._id; // Assuming you have user ID from authentication middleware

        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(image);

        const imageUrl = result.secure.url;


        // Create a new book and save it to the database
        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: userId,
        });

        await newBook.save();

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            book: newBook,
        });
    }catch(error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const getAllBooks = async(req,res)=>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page -1) * limit
        const books = await Book.find().sort({createdAt : -1}).skip(skip).limit(limit).populate("user", "username profileImage")

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            books,
            currentPage: page,
            totalBooks:books.length,
            totalPage: Math.ceil(books.length / limit)
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const getBookbyUser = async(req,res)=>{

    try {
        const userId = req.user._id;
        const book = await Book.find({user:userId}).sort({createdAt : -1})
        if(!book) return res.status(404).json({message:"book not found"})
            res.status(200).json({
                success: true,
                message: "Books fetched successfully",
                book,
            })
        } catch (error) {
        console.log(error)
    }

}

export const deleteBook = async (req, res) => {
   try {
    const {bookId} = req.params

    if(!bookId) return res.status(400).json({message:"book not found"})

    if(book.user.toString() !== req.user._id.toString()) return res.status(400).json({message:"not authorized"})

        if(book.image && book.image.includes("cloudinary")) {
           try {
            const publicId = book.image.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(publicId)
           } catch (error) {
            console.log(error, "error deleting image from cloudinary")
           }
        }

        const book = await Book.findByIdAndDelete(bookId)

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            book
        })
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Internal server error",
    })
   }
}

