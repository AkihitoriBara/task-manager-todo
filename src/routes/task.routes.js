const router = require("express").Router();

const authenticate = require("../middleware/auth.middleware");

const {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller");

router.get("/", authenticate, getTasks);
router.post("/", authenticate, createTask);
router.patch("/:id/status", authenticate, updateTaskStatus);
router.delete("/:id", authenticate, deleteTask);

module.exports = router;
