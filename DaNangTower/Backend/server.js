import express from "express";
import cors from "cors";
const app = express();
import route from "./Routes/index";
import dotenv from "dotenv";
import passport from "passport";
import session from 'express-session'
import "./api/Controllers/passport";
import DB from "./config/db/index";
import morgan from "morgan";
dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    credentials: true,
  })
);

DB.connect();

app.use(express());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true, cookie: {maxAge: 60*60*100} }))
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  let allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// route
route(app);

app.listen(process.env.PORT, () => {
  console.log(`App listening at ${process.env.SERVER_PATH}`.yellow.bold);
});
