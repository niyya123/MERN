import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import passport from "passport";
import User from "../Models/User"
import jwt from "jsonwebtoken";
dotenv.config();

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const currentUser = await User.findOne({'email': profile.emails[0].value});
      if (currentUser) {
        const { password, ...others } = currentUser._doc;
          const token = jwt.sign(
            {
              user_id: currentUser._id,
              isAdmin: currentUser.isAdmin,
              email: currentUser.email,
            },
            process.env.TOKEN_KEY,
            { expiresIn: "1d" }
          );
          done(null, { ...others, token });
      }
      else {
        const newUser = await User({
          email: profile.emails[0].value,
          password: bcrypt.hashSync("123456", 10),
          image: profile.photos[0].value,
          name: profile.displayName,
          address: {
            province: "Thành phố Hà Nội",
            district: "Quận Ba Đình",
            ward: "Phường Phúc Xá",
            addressdetail: "27/B5",
          }
        }).save();
        if (newUser) {
          const token = jwt.sign(
            {
              user_id: newUser._id,
              isAdmin: newUser.isAdmin,
              email: newUser.email,
            },
            process.env.TOKEN_KEY,
            { expiresIn: "1d" }
          );
          const { password, ...others } = newUser._doc;
          done(null, { ...others, token });
        }
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


