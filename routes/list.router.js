import express from 'express';
import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import { isLoggedIn,isOwner, validateListing,} from '../middlewares/middleware.js';

import {
   createListings,
   destroyListing,
   index, 
   renderEditForm,
   renderNewForm,
   showRoute, 
   updateListing
 } from "../controllers/listing.controller.js"

const router =Router(); 

router.route("/")
.get(wrapAsync(index))

.post(upload.single("listing[image]"), (req, res) => {
  res.send(req.file);
});

router.get("/new",isLoggedIn,renderNewForm);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));

router.route("/:id")
.get(wrapAsync(showRoute))
.put(isLoggedIn,isOwner, validateListing,wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));




export default router;