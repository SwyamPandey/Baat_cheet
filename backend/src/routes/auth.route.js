import express from "express";
const router=express.Router()

import { Login,Logout,signup } from "../controller/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"
import { checkAuth } from "../controller/auth.controller.js";
import { updateProfile } from "../controller/auth.controller.js";
router.post("/signup",signup)

router.post("/Logout",Logout)
router.post("/Login",Login);
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth)


export default router;