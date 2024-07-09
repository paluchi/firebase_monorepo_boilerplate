import { Request, Response } from "express";
import { getTodoService } from "@/context.js";

export default async (req: Request, res: Response) => {
  try {
    console.log("GET /todo");

    const todoService = await getTodoService();

    const todos = await todoService.getTodos();

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
