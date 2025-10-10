import express from 'express';
import { Router } from 'express';
import {User} from "../models/user.model.js"
import wrapAsync from '../utils/Wrapasync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middlewares/middleware.js';

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
        req.login(registeredUser,(err)=>{
        if(err) 
            return next(err);
        req.flash("success","Welcome To The WonderLust");
        res.redirect("/listings");
    });
      
    } catch (e) {
        req.flash("error",  e.message);
        res.redirect("/signup");
        
    }

}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",
     saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),
async(req,res)=>{
    req.flash("success","Welcome To WonderLust! You Logged In");
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err) 
            return next(err);
        req.flash("success","Logged Out Successfully");
        res.redirect("/listings");
    });
});



export default router;