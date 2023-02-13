import express from "express";
const router = express.Router();
import * as address from "../api/Controllers/Address.js";

router.get("/district", address.District);
router.get("/district/ward", address.Ward);
router.get("/getalladress", address.GetAllAddress);
router.get("/district/:name", address.GetDistrict);
router.get("/ward/:name1/:name2", address.GetWard);

export default router;
