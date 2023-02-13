import express from "express";
const router = express.Router();
import * as user from "../api/Controllers/user";
import * as verification from "../middlewares/authVerification";

//method for only auth user
router.get("/profile/:id", verification.verifyTokenAuth, user.getUser);
router.post("/update/:id", verification.verifyTokenAuth, user.updateUser);
router.post("/profile/:id/changePass", verification.verifyTokenAuth, user.changePass);

export default router;
