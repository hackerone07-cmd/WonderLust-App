import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import ExpressError from '../utils/ExpressError.js';
import {  reviewSchema } from '../schema.js';
import { Listing } from '../models/listing.model.js';
import { Review } from '../models/reviews.model.js';
const router =Router({mergeParams: true}); 





const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg =error.details.map((el)=> el.message).join(","); 
      throw new ExpressError(404,result.error);
    }else{
      next(); 
    }
  } 


router.post("/",validateReview,wrapAsync( async (req, res) => {
 
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(401,"listing not found!");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
  

    await newReview.save();
    await listing.save();

    console.log("Review saved");
    res.redirect(`/listings/${listing._id}`);
  
  
}));

//Delete Review Wrote
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
  
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


export default router;