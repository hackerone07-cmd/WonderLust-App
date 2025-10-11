
import mongoose from 'mongoose';
import { sampleList } from './data.js';
import { Listing } from '../models/listing.model.js';

mongoose.connect('mongodb://localhost:27017/wonderLust', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("✅ Connected to MongoDB");

  await Listing.deleteMany({});
 

  await Listing.insertMany(sampleList);

  console.log("🌱 Sample listings inserted");
  mongoose.connection.close();
})
.catch(err => console.error("❌ MongoDB connection error:", err));