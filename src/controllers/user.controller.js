import { asyncHandler } from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user-model.js"
import { uploadfile }  from "../utils/cloudinary.js"
import { ApiResponse } from  "../utils/ApiResponse.js"

const genAccessandRefreshToken = async(userId)=>
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()

        user.refreshToken= refreshToken
        await user.save({ validateBeforeSave: false})

        return { accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong While generating Access and refresh Token")
    }
}


const registerUser = asyncHandler( async( req, res)=>{
    //get user details
    // check for validation 
    // check if user already exists via username or mail
    // check for images, and avatar    // create a user object- entry in DB\
    // remove password and refresh token field from response
    // message for the creation success or fail
    // return res
    const {fullname, email, username, password} = req.body

    if([fullname,email,username,password].some((it)=>
    {return it?.trim()===""}))
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
    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath= req.files?.coverImage[0]?.path;
        console.log(avatarLocalpath);
    if(!avatarLocalpath)
        {
            throw new ApiError(401, "Avatar file is Required");
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

    const loginUser = asyncHandler( async( req, res)=>{
        // req body
        // username or email
        // find user in DB
        // password check
        // access and refresh token
        // send cookie (secure)
        const {email,username,password}= req.body
        if(!username && !email)
        {
            throw new ApiError(400, "username or email is required")
        }
        const user = await User.findOne(
            $or: [{username, {email}}]
        )
        if(!user)
        {
            throw new ApiError(404, "User doed not exist")
        }
        const isvalid = await  user.isPasswordCorrect(password);
        if(!isvalid)
            {
                throw new ApiError(401, "Invalid Password")
            }
        // created a method for it
        const {accessToken, refreshToken}=  await genAccessandRefreshToken(user._id)

        const options ={
            httpOnly: true,
            secure: true
        }
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken,options)
        .json(
           new ApiResponse(
            200,
            {
                user: accessToken, refreshToken
            },
            "User logged in successfully"
           )  
        )
    })

    const logoutUser = asyncHandler( async( req, res)=>{
          
    })





export{ 
    registerUser,
    loginUser,
}