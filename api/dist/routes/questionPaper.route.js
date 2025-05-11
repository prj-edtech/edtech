"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionPaper_controller_1 = require("../controllers/questionPaper.controller");
const questionPaperRouter = express_1.default.Router();
// Create a new question paper
questionPaperRouter.post("/", questionPaper_controller_1.createQuestionPaperController);
// Update an existing question paper by ID
questionPaperRouter.put("/:id", questionPaper_controller_1.updateQuestionPaperController);
// Get question papers by boardId, standardId, subjectId (as query params)
questionPaperRouter.get("/:boardId/:standardId/:subjectId", questionPaper_controller_1.getQuestionPapersByBoardStandardSubjectController);
// Soft delete a question paper by ID
questionPaperRouter.delete("/:id", questionPaper_controller_1.softDeleteQuestionPaperController);
exports.default = questionPaperRouter;
