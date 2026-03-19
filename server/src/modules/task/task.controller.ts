import { prisma } from "../../lib/prisma";
import { Response } from "express";
import { TypedRequest } from "../../types/request";

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
