import express from "express";
const router = express.Router();
import * as admin from '../api/Controllers/user';
import * as verification from '../middlewares/authVerification';

//method with admin right
router.delete("/deleteUser/:id", verification.verifyTokenAdmin, admin.deleteUser);
router.delete("/deleteUsers", verification.verifyTokenAdmin, admin.deleteManyUsers);
router.put("/update/:id", verification.verifyTokenAdmin, admin.updateUser);
router.get("/getUser/:id", verification.verifyTokenAdmin, admin.getUser);
router.post("/createUser", verification.verifyTokenAdmin, admin.insertUser);
router.get("/", verification.verifyTokenAdmin, admin.getAll);

export default router;
