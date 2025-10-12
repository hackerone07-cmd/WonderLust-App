 
 import {User} from "../models/user.model.js"
 
 const renderSignup =  (req,res)=>{
    res.render("users/signup.ejs")
}


const signup = async(req,res)=>{
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

}
const renderLogin = (req,res)=>{
    res.render("users/login.ejs")
}

const login = async(req,res)=>{
    req.flash("success","Welcome To WonderLust! You Logged In");
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
}

const logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err) 
            return next(err);
        req.flash("success","Logged Out Successfully");
        res.redirect("/listings");
    });
}




export {
    renderSignup,
    signup,
    renderLogin,
    login,
    logout,


}