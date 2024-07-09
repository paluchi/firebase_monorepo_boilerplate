import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    console.log("GET /AUTH");

    res
      .status(200)
      .json({ message: "hello auth user!", user: (req as any).user });
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
