import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import { isLoggedIn,isOwner, validateListing,} from '../middlewares/middleware.js';
import multer from 'multer';
import { cloudStorage } from '../cloudConfig.js';
const upload = multer({storage: cloudStorage});
import {
   createListings,
   destroyListing,
   index, 
   renderEditForm,
   renderNewForm,
   showRoute, 
   updateListing
 } from "../controllers/listing.controller.js"

const router = Router(); 

router.route("/")
.get(wrapAsync(index))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
   validateListing,
  
 
  wrapAsync(createListings),

);

router.get("/new",isLoggedIn,renderNewForm);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));

router.route("/:id")
.get(wrapAsync(showRoute))
.put(isLoggedIn,
   isOwner,
   upload.single("listing[image]"),
   validateListing,
   wrapAsync(updateListing)
  )
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));




export default router;