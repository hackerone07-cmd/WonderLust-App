import { Listing } from "../models/listing.model.js";
import ExpressError from "../utils/ExpressError.js";
import { listingSchema,reviewSchema } from "../schema.js";
import { Review } from "../models/reviews.model.js";


const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg =error.details.map((el)=> el.message).join(","); 
      throw new ExpressError(404,result.error);
    }else{
      next(); 
    }
  }
const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg =error.details.map((el)=> el.message).join(","); 
      throw new ExpressError(404,result.error);
    }else{
      next(); 
    }
  } 


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

const isOwner = async(req,res,next)=>{
    let {id}  =req.params;
   let listing =  await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);   
   }
next();
}
const isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}  =req.params;
   let review=  await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the Author of this Review");
   return res.redirect(`/listings/${id}`);   
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
saveRedirectUrl,
isOwner,
validateListing,
validateReview,
isReviewAuthor,
};
