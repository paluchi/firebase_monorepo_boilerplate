import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { initialize } from "@/context";

const onlyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await initialize();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      (req as any).user = decodeValue;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (e) {
    console.log("e", e);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default onlyAuth;
