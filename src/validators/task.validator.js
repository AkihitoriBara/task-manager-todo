const { z } = require("zod");

const createTaskSchema = z.object({
  task_name: z.string().min(3, "Task name must be at least 3 characters"),

  description: z.string().min(5, "Description must be at least 5 characters"),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

module.exports = {
  createTaskSchema,
  updateStatusSchema,
};
