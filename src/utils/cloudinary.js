import { v2 as cloudinary } from "cloudinary";
import fs from "fs"    // file handling

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const uploadfile = async function (filepath) {
    try {
        if (!filepath) {
            console.log("Could not get file path");
            return null
        }
        console.log(filepath);
        const response=await cloudinary.uploader.upload(filepath,{
            resource_type: "auto"
        })

        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ");
        fs.unlinkSync(filepath)
        return response;

    } catch (error) {
        console.log("Could not upload on cloudinary");
        fs.unlinkSync(filepath) // as file is not uploaded then remove it
        return null;
        
    }
}
export {uploadfile}