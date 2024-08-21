import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from 'cors'
import authRouter from './routes/auth.route.js'
import { connectDB } from "./db/db.js";

const app = express();
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
