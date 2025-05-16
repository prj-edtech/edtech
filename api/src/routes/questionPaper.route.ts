import express from "express";
import {
  createQuestionPaperController,
  updateQuestionPaperController,
  getQuestionPapersByBoardStandardSubjectController,
  softDeleteQuestionPaperController,
  deleteQuestionPaper,
  getAllQuestionPaper,
} from "../controllers/questionPaper.controller";

const questionPaperRouter = express.Router();

// Create a new question paper
questionPaperRouter.post("/", createQuestionPaperController);

// Update an existing question paper by ID
questionPaperRouter.put("/:id", updateQuestionPaperController);

// Get question papers by boardId, standardId, subjectId (as query params)
questionPaperRouter.get(
  "/:boardId/:standardId/:subjectId",
  getQuestionPapersByBoardStandardSubjectController
);

// Soft delete a question paper by ID
questionPaperRouter.delete("/:id", softDeleteQuestionPaperController);

// Hard delete a question paper by ID
questionPaperRouter.delete("/:id/remove", deleteQuestionPaper);

// Fetch all question papers
questionPaperRouter.get("/", getAllQuestionPaper);

export default questionPaperRouter;
