import dotenv from "dotenv"
import connectDB from "./db/index2.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000, ()=>{
        console.log(`server is running at port:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed!!!",err)
})