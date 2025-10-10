const isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error",`you must be logged in to create listings`);
    return res.redirect("/login");

   }
   next();

};

const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

}

// const isLoggedInEdit = (req,res,next) =>{
//     if(!req.isAuthenticated()){
//     req.flash("error",`you must be logged in to Edit listings`);
//     return res.redirect("/login");

//    }
//    next();

// }
// const isLoggedInDelete = (req,res,next) =>{
//     if(!req.isAuthenticated()){
//     req.flash("error",`you must be logged in to Delete listings`);
//     return res.redirect("/login");

//    }
//    next();

// }

export {isLoggedIn,
// isLoggedInEdit,
// isLoggedInDelete,
saveRedirectUrl

};
