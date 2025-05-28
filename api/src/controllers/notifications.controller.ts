import { Request, Response } from "express";
import * as notificationsServices from "../services/notifications.service";

export const getAllNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await notificationsServices.getAllNotifications();
    res.status(200).json({ total: notifications.length, data: notifications });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
