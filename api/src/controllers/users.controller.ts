import { Request, Response } from "express";
import * as userServices from "../services/users.service";

// Get all users
export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({ success: true, total: users.length, data: users });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get user by id
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Create new user (from Auth0 webhook)
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { auth0Id, email, name, role, picture } = req.body;

    if (!auth0Id || !email || !name || !role) {
      res.status(400).json({
        success: false,
        message: "auth0Id, email, name and role are required",
      });
    }

    const newUser = await userServices.createUser({
      auth0Id,
      email,
      name,
      role,
      picture,
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user by id
export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userServices.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    await userServices.deleteUserById(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
