import express from "express";
import EavesController from "./EavesController.js";
const router = express.Router();
router.route("/").get(EavesController.apiGetEaves);
export default router;
