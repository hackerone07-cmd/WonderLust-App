import { Listing} from "../models/listing.model.js";

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

const createListings = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    //using Multer with CloudinaryStorage
    if (req.file) {
      newListing.image = {
        url: req.file.path,       // Cloudinary give .path
        filename: req.file.filename,
      };
    }
  console.log(newListing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

const renderEditForm = async(req,res)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing you requested for does not exist");
   return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl =originalImageUrl.replace("/upload","/upload/w_150");
  res.render("listings/edit.ejs",{listing, originalImageUrl});
}
const updateListing  =async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data fot listings")
  }
   let {id}  =req.params;
  
 let newListing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if (typeof req.file !=="undefined") {
      newListing.image = {
        url: req.file.path,       // Cloudinary give .path
        filename: req.file.filename,
      };
      await newListing.save();
    }
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