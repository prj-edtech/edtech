"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionsByPaperController = exports.getQuestionByIdController = exports.getAllQuestionsController = exports.deactivateQuestionController = exports.activateQuestionController = exports.deleteQuestionController = exports.updateQuestionController = exports.createQuestionController = void 0;
const questionServices = __importStar(require("../services/questions.service"));
/**
 * Create Question
 * POST /api/questions
 */
const createQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { performedBy } = req.body;
        const question = yield questionServices.createQuestion(req.body, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Question created", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createQuestionController = createQuestionController;
/**
 * Update Question
 * PUT /api/questions/:id
 */
const updateQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        const question = yield questionServices.updateQuestion(id, req.body, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Question updated", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateQuestionController = updateQuestionController;
/**
 * Delete Question
 * DELETE /api/questions/remove/:id
 */
const deleteQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        const question = yield questionServices.deleteQuestion(id, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Question deleted", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteQuestionController = deleteQuestionController;
/**
 * Activate Question
 * PATCH /api/questions/activate/:id
 */
const activateQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        const question = yield questionServices.activateQuestion(id, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Question activated", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.activateQuestionController = activateQuestionController;
/**
 * Deactivate Question
 * PATCH /api/questions/deactivate/:id
 */
const deactivateQuestionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        const question = yield questionServices.deactivateQuestion(id, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Question deactivated", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deactivateQuestionController = deactivateQuestionController;
/**
 * Get All Questions
 * GET /api/questions
 * Optional query: ?isActive=true
 */
const getAllQuestionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isActive = req.query.isActive
            ? req.query.isActive === "true"
            : undefined;
        const questions = yield questionServices.getAllQuestions(isActive);
        res
            .status(200)
            .json({ success: true, message: "Questions fetched", data: questions });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllQuestionsController = getAllQuestionsController;
/**
 * Get Question By ID
 * GET /api/questions/:id
 */
const getQuestionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield questionServices.getQuestionById(id);
        res
            .status(200)
            .json({ success: true, message: "Question fetched", data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getQuestionByIdController = getQuestionByIdController;
/**
 * Get Questions By QuestionPaper ID
 * GET /api/questions/paper/:questionPaperId
 */
const getQuestionsByPaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionPaperId } = req.params;
        const questions = yield questionServices.getQuestionsByQuestionPaperId(questionPaperId);
        res
            .status(200)
            .json({ success: true, message: "Questions fetched", data: questions });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getQuestionsByPaperController = getQuestionsByPaperController;
