import { prisma } from "../../lib/prisma";
import { Response } from "express";
import { TypedRequest } from "../../types/request";
import { TaskCreateBody } from "./task.schema";

export async function getTasks(req: TypedRequest, res: Response) {
  try {
    const { id } = req.user!;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ userId: id }, { members: { some: { userId: id } } }],
      },
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

    const { title, description, dueDate, priority } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        dueDate,
        priority,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        priority: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "Task created", task: newTask });
  } catch (error) {
    console.log("CREATE_TASK_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
