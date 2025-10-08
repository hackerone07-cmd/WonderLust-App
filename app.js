import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';

import listings from './routes/list.js';
import reviews from "./routes/review.js";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Correct EJS setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// MongoDB connection
main()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}

// Route
app.get("/", (req, res) => {
  res.send("welcome home");// Make sure views/home.ejs exists
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// Server
app.listen(8080, () => {
  console.log("Server is running at port 8080");
});