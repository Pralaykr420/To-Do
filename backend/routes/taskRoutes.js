import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// every task route requires a valid logged-in user
router.use(protect);

router.route("/").get(getTasks).post(createTask);

router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

router.route("/:id/toggle").patch(toggleTask);

export default router;
