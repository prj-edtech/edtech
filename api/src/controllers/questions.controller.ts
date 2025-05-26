import { Request, Response } from "express";
import * as questionServices from "../services/questions.service";

/**
 * Create Question
 * POST /api/questions
 */
export const createQuestionController = async (req: Request, res: Response) => {
  try {
    const { performedBy } = req.body;
    const question = await questionServices.createQuestion(
      req.body,
      performedBy
    );
    res
      .status(200)
      .json({ success: true, message: "Question created", data: question });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update Question
 * PUT /api/questions/:id
 */
export const updateQuestionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;
    const question = await questionServices.updateQuestion(
      id,
      req.body,
      performedBy
    );
    res
      .status(200)
      .json({ success: true, message: "Question updated", data: question });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete Question
 * DELETE /api/questions/remove/:id
 */
export const deleteQuestionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;
    const question = await questionServices.deleteQuestion(id, performedBy);
    res
      .status(200)
      .json({ success: true, message: "Question deleted", data: question });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Questions
 * GET /api/questions
 * Optional query: ?isActive=true
 */
export const getAllQuestionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const isActive = req.query.isActive
      ? req.query.isActive === "true"
      : undefined;
    const questions = await questionServices.getAllQuestions(isActive);
    res
      .status(200)
      .json({ success: true, message: "Questions fetched", data: questions });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Question By ID
 * GET /api/questions/:id
 */
export const getQuestionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const question = await questionServices.getQuestionById(id);
    res
      .status(200)
      .json({ success: true, message: "Question fetched", data: question });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Questions By QuestionPaper ID
 * GET /api/questions/paper/:questionPaperId
 */
export const getQuestionsByPaperController = async (
  req: Request,
  res: Response
) => {
  try {
    const { questionPaperId } = req.params;
    const questions = await questionServices.getQuestionsByQuestionPaperId(
      questionPaperId
    );
    res
      .status(200)
      .json({ success: true, message: "Questions fetched", data: questions });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
