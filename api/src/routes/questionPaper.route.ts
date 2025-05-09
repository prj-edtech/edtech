import express from "express";
import {
  createQuestionPaperController,
  updateQuestionPaperController,
  getQuestionPapersByBoardStandardSubjectController,
  softDeleteQuestionPaperController,
} from "../controllers/questionPaper.controller";

const questionPaperRouter = express.Router();

// Create a new question paper
questionPaperRouter.post("/", createQuestionPaperController);

// Update an existing question paper by ID
questionPaperRouter.put("/:id", updateQuestionPaperController);

// Get question papers by boardId, standardId, subjectId (as query params)
questionPaperRouter.get("/", getQuestionPapersByBoardStandardSubjectController);

// Soft delete a question paper by ID
questionPaperRouter.delete("/:id", softDeleteQuestionPaperController);

export default questionPaperRouter;
