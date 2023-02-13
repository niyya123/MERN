import express from "express";
const router = express.Router();
import * as event from "../api/Controllers/Event";


// Public
router.get("/", event.getAllEvent);

// Admin
router.get("/getEvent/:id", event.getEventById);
router.post("/createEvent",event.addEvent);
router.delete("/deleteEvent/:id",event.deleteEvent);
router.delete("/deleteEvents",event.deleteManyEvents);
router.put("/updateEvent/:id",event.updateEvent);

export default router;
