import { Router } from "express";
import * as questionControllers from "../controllers/questions.controller";

const questionRouter = Router();

// Create Question
questionRouter.post("/", questionControllers.createQuestionController);

// Update Question
questionRouter.put("/:id", questionControllers.updateQuestionController);

// Delete Question (hard delete — remove)
questionRouter.delete(
  "/remove/:id",
  questionControllers.deleteQuestionController
);

// Activate Question
questionRouter.patch(
  "/activate/:id",
  questionControllers.activateQuestionController
);

// Deactivate Question
questionRouter.patch(
  "/deactivate/:id",
  questionControllers.deactivateQuestionController
);

// Get All Questions (optional query: ?isActive=true)
questionRouter.get("/", questionControllers.getAllQuestionsController);

// Get Question by Database ID
questionRouter.get("/:id", questionControllers.getQuestionByIdController);

// Get Questions by QuestionPaper ID
questionRouter.get(
  "/paper/:questionPaperId",
  questionControllers.getQuestionsByPaperController
);

// Approve Question
questionRouter.patch(
  "/approve/:id",
  questionControllers.approveQuestionController
);

// Reject Question
questionRouter.patch(
  "/reject/:id",
  questionControllers.rejectQuestionController
);

// Reset Question
questionRouter.patch("/reset/:id", questionControllers.resetQuestionController);

export default questionRouter;
