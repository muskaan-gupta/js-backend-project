import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);   // this "/register" will be use to get response

export default router