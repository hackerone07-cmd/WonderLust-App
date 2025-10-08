
import mongoose from "mongoose";
 import { Schema } from "mongoose";

 const reviewSchema = new Schema({
       
       rating:{
        type: Number,
        min:1,
        max:5
       },
       comment: String,
 } ,{timestamps: true})

export const Review = mongoose.model("Review",reviewSchema);