import { prisma } from "../../lib/prisma";
import { Response } from "express";
import { TypedRequest } from "../../types/request";
import { TaskCreateBody, TaskIdParams, TaskUpdateBody } from "./task.schema";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  checked: true,
  createdAt: true,
  members: {
    select: {
      id: true,
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  },
};

export async function getTasks(req: TypedRequest, res: Response) {
  try {
    const { id } = req.user!;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ userId: id }, { members: { some: { userId: id } } }],
      },
      select: taskSelect,
    });

    res.status(200).json({ message: "Fetched all tasks", tasks });
  } catch (error) {
    console.log("GET_TASKS_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTask(
  req: TypedRequest<{}, TaskCreateBody, {}>,
  res: Response,
) {
  try {
    const { id: userId } = req.user!;

    const { title, description, dueDate, priority, memberIds } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate,
        priority,
        userId,
        members: {
          create: (memberIds ?? []).map((uid) => ({ userId: uid })),
        },
      },
      select: taskSelect,
    });

    return res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    console.log("CREATE_TASK_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function toggleTaskStatus(
  req: TypedRequest<TaskIdParams, {}, {}>,
  res: Response,
) {
  try {
    const { id: userId } = req.user!;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { checked: !task.checked },
    });

    res.status(200).json({ message: "Task status updated", task: updated });
  } catch (error) {
    console.log("TOGGLE_TASK_STATUS_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateTask(
  req: TypedRequest<TaskIdParams, TaskUpdateBody, {}>,
  res: Response,
) {
  try {
    const { id: userId } = req.user!;
    const { id } = req.params;
    const { title, description, dueDate, priority, memberIds } = req.body;

    const task = await prisma.task.findFirst({ where: { id, userId } });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await prisma.taskMember.deleteMany({ where: { taskId: id } });

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description || null,
        dueDate,
        priority,
        members: {
          create: (memberIds ?? []).map((uid) => ({ userId: uid })),
        },
      },
      select: taskSelect,
    });

    res.status(200).json({ message: "Task updated", task: updated });
  } catch (error) {
    console.log("UPDATE_TASK_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTask(
  req: TypedRequest<TaskIdParams, {}, {}>,
  res: Response,
) {
  try {
    const { id: userId } = req.user!;
    const { id } = req.params;

    const task = await prisma.task.findFirst({ where: { id, userId } });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log("DELETE_TASK_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
