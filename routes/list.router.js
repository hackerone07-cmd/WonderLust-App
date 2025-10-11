import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import ExpressError from '../utils/ExpressError.js';
import { listingSchema } from '../schema.js';
import { Listing } from '../models/listing.model.js';
import { isLoggedIn,isOwner, validateListing,} from '../middlewares/middleware.js';
const router =Router(); 




router.get("/",async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});



router.get("/new",isLoggedIn,(req,res)=>{
   
   res.render("listings/new.ejs")
})



//create listing
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
let listing = await Listing.findById(id)
  .populate("owner")
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  });

  if(!listing){
    req.flash("error","Listing you requested for does not exist");
   return res.redirect("/listings");
  }
 
  res.render("listings/show.ejs",{listing});
}))


//create route
router.post("/",
  isLoggedIn,
  validateListing,wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(404,result.error);
    }
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}))


//edit route
router.get("/:id/edit",
  isLoggedIn
  ,isOwner,wrapAsync(async(req,res)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
   return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
})
)
//update route
router.put("/:id",
  
  isLoggedIn,
  isOwner,
  validateListing,wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data fot listings")
  }
   let {id}  =req.params;
  
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);    
})
)

//delete route
router.delete("/:id",
  isLoggedIn,isOwner
  ,wrapAsync(async(req,res)=>{
       let {id} =req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
        req.flash("success","Listing Deleted! ");
     res.redirect("/listings");

}))





export default router;