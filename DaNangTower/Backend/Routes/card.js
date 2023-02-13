import express from "express";
import {
  addEvent,
  createCard,
  deleteCard,
  deleteManyCards,
  findCard,
  getAll,
} from "../api/Controllers/Card";
const router = express.Router();

router.post("/addEvent", addEvent);
router.post("/createCard", createCard);
router.post("/findCard", findCard);
router.post("/deleteCard", deleteCard);
router.post("/deleteManyCards", deleteManyCards);
router.get("/", getAll);

export default router;
