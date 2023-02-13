import  express from "express";
const router = express.Router();
import * as BuildingController from '../api/Controllers/Building';

router.post("/import", BuildingController.importBuilding);
router.get("/getBuilding/:id", BuildingController.getBuildings);
router.get("/getDeletedBuilding/:id", BuildingController.getDeletedBuilding);
router.get("/getAllBuilding", BuildingController.getAllBuilding);
router.put("/updateBuilding/:id", BuildingController.updateBuilding);
export default router;


