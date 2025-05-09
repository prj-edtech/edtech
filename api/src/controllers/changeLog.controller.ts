import { Request, Response } from "express";
import { fetchAllChangeLog } from "../services/changeLog.service";

export const getAllChangeLogs = async (_req: Request, res: Response) => {
  try {
    const changeLogs = await fetchAllChangeLog();
    res.status(200).json({ data: changeLogs });
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
};
