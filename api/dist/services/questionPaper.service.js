"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllQuestionPaper = exports.removeQuestionPaper = exports.softDeleteQuestionPaper = exports.getQuestionPapersByBoardStandardSubject = exports.updateQuestionPaper = exports.createQuestionPaper = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62");
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
// Create Question Paper
const createQuestionPaper = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a unique ID for the Question Paper (could be similar to how you generate subtopicId)
    const questionPaperId = (0, base62_1.base62Encode)(); // Or any other method for generating a unique identifier
    // Build partition and sort keys like in the SubTopic service
    const partitionKey = `QuestionPaper#${data.boardCode}#${data.standardCode}`;
    const sortKey = `${data.subjectName}#${data.year}#${data.month}#${questionPaperId}`;
    // Assemble the strict production JSON (mirroring the same structure for consistency)
    const questionPaperJson = {
        partitionKey,
        sortKey,
        year: data.year,
        month: data.month,
        totalMarks: data.totalMarks,
        attributes: data.attributes,
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
    };
    // Create the Question Paper in the database, include the relational data (board, standard, subject)
    const questionPaper = yield db_1.default.questionPaper.create({
        data: {
            partitionKey,
            sortKey,
            year: data.year,
            month: data.month,
            totalMarks: data.totalMarks,
            attributes: data.attributes,
            isActive: data.isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            questionPaperJson, // Store the full JSON structure for audit and reference
            // Include the required relations (board, standard, and subject)
            board: {
                connect: { id: data.boardId }, // Assuming boardId is the primary key in Board model
            },
            standard: {
                connect: { id: data.standardId }, // Assuming standardId is the primary key in Standard model
            },
            subject: {
                connect: { id: data.subjectId }, // Assuming subjectId is the primary key in Subject model
            },
        },
    });
    // Create an audit log for the creation of the question paper
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QuestionPaper",
        entityId: questionPaper.id,
        action: "CREATE",
        performedBy: data.createdBy,
        details: questionPaperJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION_PAPER",
        entityId: questionPaper.id,
        changeType: "CREATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.createdBy,
        createdBy: data.createdBy,
        notes: "Question paper created",
    });
    return questionPaper;
});
exports.createQuestionPaper = createQuestionPaper;
// Update Question Paper
const updateQuestionPaper = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.default.questionPaper.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new Error("QuestionPaper not found");
    }
    const updatedJson = Object.assign(Object.assign(Object.assign({}, existing.questionPaperJson), updates), { updatedAt: new Date().toISOString(), updatedBy: updates.updatedBy || existing.updatedBy });
    const updated = yield db_1.default.questionPaper.update({
        where: { id },
        data: Object.assign(Object.assign({}, updates), { questionPaperJson: updatedJson }),
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QuestionPaper",
        entityId: id,
        action: "UPDATE",
        performedBy: updates.updatedBy || existing.updatedBy,
        details: updatedJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION_PAPER",
        entityId: id,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: updates.updatedBy || existing.updatedBy,
        createdBy: updates.updatedBy || existing.updatedBy,
        notes: "Question paper updated",
    });
    return updated;
});
exports.updateQuestionPaper = updateQuestionPaper;
// Fetch by Board-Standard-Subject
const getQuestionPapersByBoardStandardSubject = (boardId, standardId, subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.questionPaper.findMany({
        where: {
            boardId,
            standardId,
            subjectId,
            isActive: true,
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.getQuestionPapersByBoardStandardSubject = getQuestionPapersByBoardStandardSubject;
// Soft Delete
const softDeleteQuestionPaper = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.default.questionPaper.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new Error("QuestionPaper not found");
    }
    const updatedJson = Object.assign(Object.assign({}, existing.questionPaperJson), { isActive: false, updatedAt: new Date().toISOString(), updatedBy: performedBy });
    const deleted = yield db_1.default.questionPaper.update({
        where: { id },
        data: {
            isActive: false,
            updatedBy: performedBy,
            questionPaperJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QuestionPaper",
        entityId: id,
        action: "SOFT_DELETE",
        performedBy,
        details: updatedJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION_PAPER",
        entityId: id,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Question paper deactivated",
    });
    return deleted;
});
exports.softDeleteQuestionPaper = softDeleteQuestionPaper;
const removeQuestionPaper = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const questionPaper = yield db_1.default.questionPaper.delete({
        where: {
            id,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QuestionPaper",
        entityId: id,
        action: "DELETE",
        performedBy: performedBy,
        details: "Question paper hard deleted",
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION_PAPER",
        entityId: id,
        changeType: "DELETE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Question paper hard deleted",
    });
    return questionPaper;
});
exports.removeQuestionPaper = removeQuestionPaper;
const getAllQuestionPaper = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.questionPaper.findMany({
        include: {
            board: true,
            standard: true,
            subject: true,
        },
    });
});
exports.getAllQuestionPaper = getAllQuestionPaper;
