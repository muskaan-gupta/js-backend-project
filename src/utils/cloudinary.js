import { v2 } from "cloudinary";
import fs from "fs"    // file handling

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const uploadfile = async(filepath)=> {
    try {
        if (!filepath) {
            return null
        }
        const response=await v2.uploader.upload(filepath,{
            resource_type: "auto"
        })

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(filepath)
        return response;

    } catch (error) {
        fs.unlinkSync(filepath) // as file is not uploaded then remove it
        return null;
        
    }
}
export {uploadfile}