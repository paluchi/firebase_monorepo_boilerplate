import { Request, Response } from "express";
import { getTodoService } from "@/context.js";

export default async (req: Request, res: Response) => {
  try {
    const todoService = await getTodoService();

    const todoId = req.params.todoId;
    const todos = await todoService.deleteTodo(todoId);

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
