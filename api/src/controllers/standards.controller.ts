import { Request, Response } from "express";
import * as standardService from "../services/standards.service";

// Controller to create a new standard
export const createStandard = async (req: Request, res: Response) => {
  try {
    const { boardId, sortKey, createdBy } = req.body;

    if (!boardId || !sortKey || !createdBy) {
      res.status(400).json({ message: "Missing required fields." });
    }

    const newStandard = await standardService.createStandard({
      boardId,
      sortKey,
      createdBy,
    });
    res.status(201).json(newStandard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all standards
export const getAllStandards = async (_req: Request, res: Response) => {
  try {
    const standards = await standardService.getAllStandards();
    res.status(200).json(standards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Controller to get all active standards
export const getAllActiveStandards = async (_req: Request, res: Response) => {
  try {
    const standards = await standardService.getAllActiveStandards();
    res.status(200).json(standards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get standard by ID
export const getStandardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const standard = await standardService.getStandardById(id);

    if (!standard) {
      res.status(404).json({ message: "Standard not found." });
    }

    res.status(200).json(standard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a standard
export const updateStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive, updatedBy } = req.body;

    if (!updatedBy) {
      res.status(400).json({ message: "updatedBy is required." });
    }

    const updatedStandard = await standardService.updateStandard(id, {
      isActive,
      updatedBy,
    });
    res.status(200).json(updatedStandard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to deactivate a standard
export const deactivateStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!performedBy) {
      res.status(400).json({ message: "performedBy is required." });
    }

    const result = await standardService.deactivateStandard(id, performedBy);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to activate a standard
export const activateStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!performedBy) {
      res.status(400).json({ message: "performedBy is required." });
    }

    const result = await standardService.activateStandard(id, performedBy);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to remove a standard
export const removeStandard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await standardService.deleteStandard(id);
    res.status(200).json({ data: result, message: "Standard deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
