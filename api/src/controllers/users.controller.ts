import { Request, Response } from "express";
import * as userServices from "../services/users.service";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({ success: true, total: users.length, data: users });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
