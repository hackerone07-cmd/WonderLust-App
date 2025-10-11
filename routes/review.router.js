import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import ExpressError from '../utils/ExpressError.js';

import { Listing } from '../models/listing.model.js';
import { Review } from '../models/reviews.model.js';
import { isLoggedIn, isReviewAuthor, validateReview } from '../middlewares/middleware.js';
const router =Router({mergeParams: true}); 







router.post("/",
  isLoggedIn,
  validateReview,
  wrapAsync( async (req, res) => {
 
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(401,"listing not found!");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
  

    await newReview.save();
    await listing.save();

    console.log("Review saved");
       req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
  
  
}));

//Delete Review Wrote
router.delete("/:reviewId", isReviewAuthor,wrapAsync(async(req,res)=>{
  let {id ,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
  
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`);
}))


export default router;