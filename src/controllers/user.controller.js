import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user-model.js"

import { uploadfile}  from "../utils/cloudinary.js"
import { ApiResponse } from  "../utils/ApiResponse.js"




const registerUser = asyncHandler( async( req, res)=>{
    //get user details
    // check for validation 
    // check if user already exists via username or mail
    // check for images, and avatar
    // create a user object- entry in DB
    // remove password and refresh token field from response
    // message for the creation success or fail
    // return res
    const {fullname, email, username, password} = req.body

    if([fullname,email,username,password].some((it)=>
    it?.trim()==""))
    {
        throw new ApiError(400, " All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]    // using $ operator for multiple values
    })

    if(existedUser)
        {
            throw new ApiError(409, "User with this email or Usermane already Exists")
        }
    const avatarLocalpath = await req.files?.avatar[0]?.path;
    const coverImageLocalpath=  await req.files?.coverImage[0]?.path;

    if(!avatarLocalpath)
        {
            throw new ApiError(401, "Avatar file is Required")
        }
    const avatar = await uploadfile(avatarLocalpath) // on cloudinary
    const coverImage = await uploadfile(coverImageLocalpath)

    if(!avatar)
        {
            throw new ApiError(401, "Avatar file is Required")
        }
    
    const user = await User.create(
        {
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "", // because coverimage is not compulsory
            email,
            password,
            username: username.toLowerCase()
        }
    )
     const createdUser=  await User.findById(user._id).select("-password -refreshToken")
     if(!createdUser)
        {
            throw new ApiError(500," Something went wrong while registering the user Retry after a while!!" )
        }
    return res.status(201).json(
        new ApiResponse(200, createdUser, " User registered successfully")
    )

    })
    

export{ registerUser}