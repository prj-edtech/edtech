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
exports.getAllQuestionPaper = exports.deleteQuestionPaper = exports.softDeleteQuestionPaperController = exports.getQuestionPapersByBoardStandardSubjectController = exports.updateQuestionPaperController = exports.createQuestionPaperController = void 0;
const questionPaperService = __importStar(require("../services/questionPaper.service"));
// Create Question Paper Controller
const createQuestionPaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructuring the request body
        const { year, month, totalMarks, attributes, isActive, createdBy, updatedBy, boardId, standardId, subjectId, boardCode, standardCode, subjectName, } = req.body;
        // Basic validation for required fields
        if (!year ||
            !month ||
            !totalMarks ||
            !boardId ||
            !standardId ||
            !subjectId) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: year, month, totalMarks, boardId, standardId, or subjectId",
            });
        }
        // Ensure all necessary attributes are provided
        if (!boardCode || !standardCode || !subjectName) {
            res.status(400).json({
                success: false,
                message: "Missing required fields for partitionKey and sortKey construction: boardCode, standardCode, subjectName",
            });
        }
        // Call the service to create the Question Paper
        const result = yield questionPaperService.createQuestionPaper({
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
    }
    catch (error) {
        // Log the error for debugging
        console.error("Create Question Paper Error:", error);
        // Send error response
        res.status(500).json({
            success: false,
            message: "Failed to create question paper",
            error: error.message,
        });
    }
});
exports.createQuestionPaperController = createQuestionPaperController;
// Update Question Paper Controller
const updateQuestionPaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updated = yield questionPaperService.updateQuestionPaper(id, updates);
        res.status(200).json({
            success: true,
            message: "Question paper updated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error("Update QuestionPaper Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update question paper",
            error: error.message,
        });
    }
});
exports.updateQuestionPaperController = updateQuestionPaperController;
// Fetch Question Papers by Board, Standard, Subject Controller
const getQuestionPapersByBoardStandardSubjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, standardId, subjectId } = req.params;
        if (!boardId || !standardId || !subjectId) {
            res.status(400).json({
                success: false,
                message: "Missing  parameters",
            });
        }
        const papers = yield questionPaperService.getQuestionPapersByBoardStandardSubject(String(boardId), String(standardId), String(subjectId));
        res.status(200).json({
            success: true,
            message: "Question papers fetched successfully",
            data: papers,
        });
    }
    catch (error) {
        console.error("Fetch QuestionPapers Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch question papers",
            error: error.message,
        });
    }
});
exports.getQuestionPapersByBoardStandardSubjectController = getQuestionPapersByBoardStandardSubjectController;
// Soft Delete Question Paper Controller
const softDeleteQuestionPaperController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!performedBy) {
            res.status(400).json({
                success: false,
                message: "Missing performedBy in request body",
            });
        }
        const result = yield questionPaperService.softDeleteQuestionPaper(id, performedBy);
        res.status(200).json({
            success: true,
            message: "Question paper soft-deleted successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Soft Delete QuestionPaper Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to soft delete question paper",
            error: error.message,
        });
    }
});
exports.softDeleteQuestionPaperController = softDeleteQuestionPaperController;
// Delete Question Paper Controller
const deleteQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield questionPaperService.removeQuestionPaper(id);
        res.status(200).json({
            success: true,
            message: "Question paper removed successfully",
            data: deleted,
        });
    }
    catch (error) {
        console.error("Update QuestionPaper Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete question paper",
            error: error.message,
        });
    }
});
exports.deleteQuestionPaper = deleteQuestionPaper;
// Delete Question Paper Controller
const getAllQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionPapers = yield questionPaperService.getAllQuestionPaper();
        res.status(200).json({
            success: true,
            data: questionPapers,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch question papers",
            error: error.message,
        });
    }
});
exports.getAllQuestionPaper = getAllQuestionPaper;
