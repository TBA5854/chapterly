import express from "express";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import boardMiddleware from "../middlewares/boardMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/",boardMiddleware, createEvent);
router.put("/:id",boardMiddleware, updateEvent);
router.delete("/:id",boardMiddleware, deleteEvent);

export default router;