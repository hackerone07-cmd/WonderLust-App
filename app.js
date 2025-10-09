import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import session, { Cookie } from 'express-session';
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import {User} from "./models/user.model.js";


import listingsRouter from './routes/list.router.js';
import reviewsRouter from "./routes/review.router.js";
import userRouter from "./routes/user.router.js"


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


const sessionOptions={
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};





// Route
app.get("/", (req, res) => {
  res.send("welcome home");// Make sure views/home.ejs exists
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);  

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// Server
app.listen(8080, () => {
  console.log("Server is running at port 8080");
});