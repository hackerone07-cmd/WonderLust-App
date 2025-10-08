
import mongoose, { Schema } from "mongoose";
import { Review } from "./reviews.model.js";


const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    
    description:String,
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        set: (v) => v===""?"https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=": v,
    },
    price: Number,
    location:String,
    country: String,
     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]

},{timestamps:true})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

export const Listing = mongoose.model("Listing",listingSchema);
