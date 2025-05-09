import { Request, Response } from "express";
import * as questionPaperService from "../services/questionPaper.service";

// Create Question Paper Controller
export const createQuestionPaperController = async (
  req: Request,
  res: Response
) => {
  try {
    // Destructuring the request body
    const {
      year,
      month,
      totalMarks,
      attributes,
      isActive,
      createdBy,
      updatedBy,
      boardId,
      standardId,
      subjectId,
      boardCode,
      standardCode,
      subjectName,
    } = req.body;

    // Basic validation for required fields
    if (
      !year ||
      !month ||
      !totalMarks ||
      !boardId ||
      !standardId ||
      !subjectId
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: year, month, totalMarks, boardId, standardId, or subjectId",
      });
    }

    // Ensure all necessary attributes are provided
    if (!boardCode || !standardCode || !subjectName) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields for partitionKey and sortKey construction: boardCode, standardCode, subjectName",
      });
    }

    // Call the service to create the Question Paper
    const result = await questionPaperService.createQuestionPaper({
      year,
      month,
      totalMarks,
      attributes,
      isActive,
      createdBy,
      updatedBy,
      boardId,
      standardId,
      subjectId,
      boardCode,
      standardCode,
      subjectName,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "Question paper created successfully",
      data: result,
    });
  } catch (error: any) {
    // Log the error for debugging
    console.error("Create Question Paper Error:", error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Failed to create question paper",
      error: error.message,
    });
  }
};

// Update Question Paper Controller
export const updateQuestionPaperController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await questionPaperService.updateQuestionPaper(id, updates);

    res.status(200).json({
      success: true,
      message: "Question paper updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update QuestionPaper Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update question paper",
      error: error.message,
    });
  }
};

// Fetch Question Papers by Board, Standard, Subject Controller
export const getQuestionPapersByBoardStandardSubjectController = async (
  req: Request,
  res: Response
) => {
  try {
    const { boardId, standardId, subjectId } = req.params;

    if (!boardId || !standardId || !subjectId) {
      res.status(400).json({
        success: false,
        message: "Missing  parameters",
      });
    }

    const papers =
      await questionPaperService.getQuestionPapersByBoardStandardSubject(
        String(boardId),
        String(standardId),
        String(subjectId)
      );

    res.status(200).json({
      success: true,
      message: "Question papers fetched successfully",
      data: papers,
    });
  } catch (error: any) {
    console.error("Fetch QuestionPapers Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question papers",
      error: error.message,
    });
  }
};

// Soft Delete Question Paper Controller
export const softDeleteQuestionPaperController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!performedBy) {
      res.status(400).json({
        success: false,
        message: "Missing performedBy in request body",
      });
    }

    const result = await questionPaperService.softDeleteQuestionPaper(
      id,
      performedBy
    );

    res.status(200).json({
      success: true,
      message: "Question paper soft-deleted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Soft Delete QuestionPaper Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to soft delete question paper",
      error: error.message,
    });
  }
};
