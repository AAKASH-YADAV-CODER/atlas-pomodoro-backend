import { Router } from "express";
import { verifyJWT } from "../middlerwares/auth.middleware.js";
import pomodoroController from "../controllers/pomodoro.controller.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

// Create a new pomodoro task
router.post("/", pomodoroController.createPomodoro);

// Get all pomodoro tasks for the authenticated user
router.get("/", pomodoroController.getAllPomodoros);

// Get a specific pomodoro task by ID
router.get("/:id", pomodoroController.getPomodoroById);

// Update a pomodoro task
router.patch("/:id", pomodoroController.updatePomodoro);
router.put("/:id", pomodoroController.updatePomodoro);

// Delete a pomodoro task
router.delete("/:id", pomodoroController.deletePomodoro);

// Update progress of a specific pomodoro task
router.patch("/:id/progress", pomodoroController.updateProgress);

// Mark a pomodoro task as completed
router.patch("/:id/complete", pomodoroController.markAsCompleted);

// Update deadline of a pomodoro task
router.patch("/:id/deadline", pomodoroController.updateDeadline);

export default router;
