import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
const router = express.Router();

dotenv.config();
router.get("/signin/success",  (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else
    return res.status(401).json({
      message: "failure",
    });
});

router.get("/signin/failed", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect(process.env.CLIENT_PATH);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_PATH}signin`,
    failureRedirect: "/api/auth/signin/failed",
  })
);


export default router;
