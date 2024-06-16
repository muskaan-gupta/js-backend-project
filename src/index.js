import dotenv from "dotenv"
import connectDB from "./db/index2.js";

dotenv.config({
    path: './env'
})

connectDB()