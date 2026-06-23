const prisma = require("../prisma");
const {
  createTaskSchema,
  updateStatusSchema,
} = require("../validators/task.validator");

const getTasks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const whereClause = {
      user_id: req.user.id,
    };

    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        {
          task_name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        created_at: "desc",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const totalTasks = await prisma.task.count({
      where: whereClause,
    });

    res.json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      total: totalTasks,
      totalPages: Math.ceil(totalTasks / limitNumber),
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    console.log("Creating task for user:", req.user);
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    const { task_name, description } = validation.data;

    const task = await prisma.task.create({
      data: {
        task_name,
        description,
        user_id: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const validation = updateStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
    }

    const { status } = validation.data;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (existingTask.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You do not own this task",
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You do not own this task",
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
};
