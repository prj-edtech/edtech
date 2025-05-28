import { Request, Response } from "express";
import {
  fetchAllChangeLog,
  deleteAllChangeLog,
} from "../services/changeLog.service";

export const getAllChangeLogs = async (_req: Request, res: Response) => {
  try {
    const changeLogs = await fetchAllChangeLog();
    res.status(200).json({ data: changeLogs });
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
};

export const deleteChangeLogs = async (_req: Request, res: Response) => {
  try {
    const changeLogs = await deleteAllChangeLog();
    res
      .status(200)
      .json({ data: changeLogs, message: "Delete all change-logs" });
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
};
