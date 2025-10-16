import dotenv from 'dotenv';
dotenv.config();

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
 

// ✅ Step 1: Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Step 2: Setup CloudinaryStorage for Multer
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust_DEV',
    allowed_formats: ['png', 'jpg', 'jpeg'], // ✅ Correct key: allowed_formats
  },
});

// ✅ Step 3: Export for use in routes/middleware
export { cloudinary, cloudStorage };