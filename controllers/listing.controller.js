import { Listing} from "../models/listing.model.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

const index = async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};

const renderNewForm =(req,res)=>{
  res.render("listings/new.ejs")
}
const showRoute =async(req,res)=>{
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
}

const createListings = async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(404,result.error);
    }
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

const renderEditForm = async(req,res)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
   return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}
const updateListing  =async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data fot listings")
  }
   let {id}  =req.params;
  
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);    
}

const destroyListing = async(req,res)=>{
       let {id} =req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
        req.flash("success","Listing Deleted! ");
     res.redirect("/listings");

}
export {
    index,
    renderNewForm,
    createListings,
    showRoute,
    renderEditForm,
    updateListing,
   destroyListing,



}