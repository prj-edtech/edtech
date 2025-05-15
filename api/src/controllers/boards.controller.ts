// api\src\controllers\boards.controller.ts

import { Request, Response } from "express";
import * as boardServices from "../services/boards.service";

// GET /api/boards
export const getAllBoardsController = async (_req: Request, res: Response) => {
  try {
    const boards = await boardServices.getAllBoards();
    res.status(200).json({ success: true, total: boards.length, data: boards });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/boards/active
export const getAllActiveBoardsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const boards = await boardServices.getAllActiveBoards();
    res.status(200).json({ success: true, total: boards.length, data: boards });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/boards/:id
export const getBoardByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await boardServices.getBoardById(id);
    if (!board) {
      res.status(404).json({ success: false, message: "Board not found" });
    }
    res.status(200).json({ success: true, data: board });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/boards
export const createBoardController = async (req: Request, res: Response) => {
  try {
    const { sortKey, displayName, createdBy } = req.body;
    const board = await boardServices.createBoard({
      sortKey,
      displayName,
      createdBy,
    });
    res.status(201).json({ success: true, data: board });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/boards/:id
export const updateBoardController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { displayName, isActive, updatedBy } = req.body;
    const board = await boardServices.updateBoard(id, {
      displayName,
      isActive,
      updatedBy,
    });
    res.status(200).json({ success: true, data: board });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/boards/:id
export const deleteBoardController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body; // should be auth0Id ideally
    const board = await boardServices.deleteBoard(id, performedBy);
    res
      .status(200)
      .json({ success: true, message: "Board soft-deleted", data: board });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/boards/remove/:id
export const removeBoardController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await boardServices.removeBoard(id);
    res
      .status(200)
      .json({ success: true, message: "Board removed", data: board });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
