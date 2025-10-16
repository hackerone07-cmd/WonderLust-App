
import mongoose, { Schema } from "mongoose";
import { Review } from "./reviews.model.js";


const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    
    description:String,
    image:{
        filename: String,
        url: String,
    },
    price: Number,
    location:String,
    country: String,
     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
     owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
     }
},{timestamps:true})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

export const Listing = mongoose.model("Listing",listingSchema);
