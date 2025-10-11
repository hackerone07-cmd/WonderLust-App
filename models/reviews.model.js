
import mongoose from "mongoose";
 import { Schema } from "mongoose";

 const reviewSchema = new Schema({
       
       rating:{
        type: Number,
        min:1,
        max:5
       },
       comment: String,
       author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
       }
 } ,{timestamps: true})

export const Review = mongoose.model("Review",reviewSchema);