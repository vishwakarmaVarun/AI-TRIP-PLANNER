import mongoose from "mongoose";

const uri = process.env.MONGO_URI

export const connectDB = async () => {
    try {
        await mongoose.connect(uri)
        console.log("Database connected successfully!")
    } catch (error) {
        console.error("Failed to connect DB", error)
    }
}