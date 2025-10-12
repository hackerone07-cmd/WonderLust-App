import { Router } from 'express';
import wrapAsync from '../utils/Wrapasync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middlewares/middleware.js';
import { login, logout, renderLogin, renderSignup, signup } from '../controllers/users.controller.js';

const router = Router();


router.route("/signup")
.get(renderSignup)
.post(wrapAsync(signup));

router.route("/login")
.get(renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}), login )
router.get("/logout",logout);

export default router;