import express from "express";
const router = express.Router();
import * as account from "../api/Controllers/user";

router.get("/signin/user", account.getUserSession);
router.post("/signin", account.signIn);
router.post("/forgotPassword/changePassword", account.changePassword);
router.post("/forgotPassword/verifyCode", account.confirmVerifyCode);
router.post("/signup/verifyCode", account.signupVerifyCode);
router.post("/signup", account.signUp);
router.post("/forgotPassword", account.forgetPassword);
router.get("/signout", account.signOut);

export default router;
