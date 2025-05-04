// api/src/controllers/subjects.controller.ts

import { Request, Response } from "express";
import * as subjectService from "../services/subjects.service";

// Create Subject Controller
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { sortKey, boardId, standardId, createdBy } = req.body;

    // Validate request body presence
    if (!sortKey || !boardId || !standardId || !createdBy) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const subject = await subjectService.createSubject({
      sortKey,
      boardId,
      standardId,
      createdBy,
    });

    res.status(201).json(subject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Subjects By Board + Standard
export const getSubjectsByBoardStandard = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId, standardId } = req.params;

    if (!boardId || !standardId) {
      res.status(400).json({ message: "Missing boardId or standardId" });
    }

    const subjects = await subjectService.getSubjectsByBoardStandard(
      boardId,
      standardId
    );

    res.status(200).json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update Subject (isActive)
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive, updatedBy } = req.body;

    if (!id || !updatedBy) {
      res.status(400).json({ message: "Missing id or updatedBy" });
    }

    const updatedSubject = await subjectService.updateSubject(id, {
      isActive,
      updatedBy,
    });

    res.status(200).json(updatedSubject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete Subject
export const softDeleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id || !performedBy) {
      res.status(400).json({ message: "Missing id or performedBy" });
    }

    const deletedSubject = await subjectService.softDeleteSubject(
      id,
      performedBy
    );

    res.status(200).json(deletedSubject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
