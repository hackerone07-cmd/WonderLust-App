import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import ExpressError from '../utils/ExpressError.js';
import { listingSchema } from '../schema.js';
import { Listing } from '../models/listing.model.js';
const router =Router(); 


const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg =error.details.map((el)=> el.message).join(","); 
      throw new ExpressError(404,result.error);
    }else{
      next(); 
    }
  }

router.get("/",async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});



router.get("/new",(req,res)=>{
   res.render("listings/new.ejs")
})



//create listing
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
}))


//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(404,result.error);
    }
    const newListing = new Listing(req.body.listing); 
    await newListing.save();
    res.redirect("/listings");
}))


//edit route
router.get("/:id/edit",async(req,res)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
})

//update route
router.put("/:id",
  validateListing,wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data fot listings")
  }
   let {id}  =req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);    
})
)

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
       let {id} =req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");

}))





export default router;