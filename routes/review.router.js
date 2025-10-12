
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import { isLoggedIn, isLoggedInDelete, isReviewAuthor, validateReview } from '../middlewares/middleware.js';
import {createReview, destroyReview } from '../controllers/reviews.controller.js';

const router =Router({mergeParams: true}); 

//create review
router.post("/",isLoggedIn,validateReview,wrapAsync( createReview));
//Delete Review Wrote
router.delete("/:reviewId", isLoggedInDelete,isReviewAuthor,wrapAsync(destroyReview));


export default router;