// api\src\controllers\sections.controller.ts

import { Request, Response } from "express";
import * as sectionService from "../services/sections.service";

// Create Section
export const createSection = async (req: Request, res: Response) => {
  try {
    const {
      sortKey,
      boardId,
      standardId,
      subjectId,
      priority,
      displayName,
      createdBy,
    } = req.body;

    if (
      !sortKey ||
      !boardId ||
      !standardId ||
      !subjectId ||
      priority === undefined ||
      !displayName ||
      !createdBy
    ) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const section = await sectionService.createSection({
      sortKey,
      boardId,
      standardId,
      subjectId,
      priority,
      displayName,
      createdBy,
    });

    res.status(201).json({ message: "Section created successfully", section });
  } catch (error: any) {
    console.error("Create Section Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Update Section
export const updateSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { displayName, priority, isActive, updatedBy } = req.body;

    if (!sectionId || !updatedBy) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const updatedSection = await sectionService.updateSection({
      sectionId,
      displayName,
      priority,
      isActive,
      updatedBy,
    });

    res.status(200).json({
      message: "Section updated successfully",
      section: updatedSection,
    });
  } catch (error: any) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get Sections by Subject
export const getSectionsBySubject = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId) {
      res.status(400).json({ message: "Missing subjectId" });
    }

    const sections = await sectionService.getSectionsBySubject(subjectId);
    res.status(200).json({ sections });
  } catch (error: any) {
    console.error("Get Sections Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Soft Delete Section
export const softDeleteSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { performedBy } = req.body;

    if (!sectionId || !performedBy) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const deletedSection = await sectionService.softDeleteSection(
      sectionId,
      performedBy
    );

    res.status(200).json({
      message: "Section soft-deleted successfully",
      section: deletedSection,
    });
  } catch (error: any) {
    console.error("Soft Delete Section Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
