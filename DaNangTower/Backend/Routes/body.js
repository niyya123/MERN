import  express from "express";
const router = express.Router();
import * as BodyController from "../api/Controllers/body.js"


router.post("/importJson", BodyController.importJsonFile);
router.get("/getBodies/:id", BodyController.getBodies);
//Note: param 'color' is hex string representing the color without '#'. 
//Example URL: http://localhost:5000/api/body/getBodies/novotel_floor_5_34/125468/0.4
router.get("/getBodies/:id/:color/:opacity", BodyController.getBodiesWithColor);
router.get("/getLines/:id", BodyController.getLines);
router.get("/getLines/:id/:color/:opacity", BodyController.getLinesWithColor);

export default router;


