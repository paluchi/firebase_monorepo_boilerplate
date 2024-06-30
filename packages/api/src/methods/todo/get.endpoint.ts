import { Request, Response } from "express";
import { todoService } from "../../context";

export default async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getTodos();

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
