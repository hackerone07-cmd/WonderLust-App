import express from 'express';
import { Router } from 'express';
import {User} from "../models/user.model.js"
import wrapAsync from '../utils/Wrapasync.js';

const router = Router();

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})



router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username, password, email} = req.body;
        const newUser = new User({email, username}); 
       const registeredUser =   await User.register(newUser,password);
       console.log(registeredUser);
       req.flash("success","Welcome to WonderLust!");
       res.redirect("/listings");
    } catch (e) {
        req.flash("error",  e.message);
        res.redirect("/signup");
        
    }

}));


export default router;