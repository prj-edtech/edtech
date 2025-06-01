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
exports.getQuestionsByQuestionPaperId = exports.getQuestionById = exports.getAllQuestions = exports.deactivateQuestion = exports.activateQuestion = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
/**
 * Create a new Question
 */
const createQuestion = (data, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const { partitionKey, sortKey, year, month, questionId, questionPaperId, sectionId, topicId, subTopicId, marks, priority, questionType, questionContentPath, questionAnswerPath, attributes, boardCode, standardCode, subject, } = data;
    const jsonData = {
        partitionKey,
        sortKey,
        year,
        month,
        questionId,
        questionPaperId,
        sectionId,
        topicId,
        subTopicId,
        marks,
        priority,
        questionType,
        questionContentPath,
        questionAnswerPath,
        attributes,
    };
    const newPartitionKey = `Question#${boardCode}#${standardCode}`;
    const newSortKey = `${subject}#${year}#${month}#${questionId}`;
    const question = yield db_1.default.question.create({
        data: {
            partitionKey: newPartitionKey,
            sortKey: newSortKey,
            year,
            month,
            questionId,
            questionPaperId,
            sectionId,
            topicId,
            subTopicId,
            marks,
            priority,
            questionType,
            questionContentPath,
            questionAnswerPath,
            attributes,
            createdBy: performedBy,
            updatedBy: performedBy,
            questionJson: jsonData,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QUESTION",
        entityId: questionId,
        action: "CREATED",
        performedBy,
        details: { newState: question },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION",
        entityId: questionId,
        changeType: "CREATE",
        changeStatus: "REQUESTED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Question created",
    });
    return question;
});
exports.createQuestion = createQuestion;
/**
 * Update an existing Question
 */
const updateQuestion = (id, data, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield db_1.default.question.findUnique({ where: { id } });
    if (!previous)
        throw new Error("Question not found");
    const { marks, priority, questionType, questionContentPath, questionAnswerPath, attributes, isActive, } = data;
    const question = yield db_1.default.question.update({
        where: { id },
        data: {
            // Only allowed fields here
            marks,
            priority,
            questionType,
            questionContentPath,
            questionAnswerPath,
            attributes,
            isActive,
            updatedBy: performedBy,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        action: "UPDATED",
        performedBy,
        details: {
            previousState: previous,
            newState: question,
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        changeType: "UPDATE",
        changeStatus: "REQUESTED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Question updated",
    });
    return question;
});
exports.updateQuestion = updateQuestion;
/**
 * Hard delete a Question
 */
const deleteQuestion = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield db_1.default.question.findUnique({ where: { id } });
    if (!previous)
        throw new Error("Question not found");
    const question = yield db_1.default.question.delete({ where: { id } });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        action: "DELETE",
        performedBy,
        details: {
            previousState: previous,
            notes: "Hard delete performed",
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        changeType: "REMOVE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Question hard deleted",
    });
    return question;
});
exports.deleteQuestion = deleteQuestion;
/**
 * Activate a Question
 */
const activateQuestion = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield db_1.default.question.findUnique({ where: { id } });
    if (!previous)
        throw new Error("Question not found");
    const question = yield db_1.default.question.update({
        where: { id },
        data: {
            isActive: true,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        action: "ACTIVATE",
        performedBy,
        details: {
            previousState: previous,
            notes: "Activation performed",
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        changeType: "ACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Activation performed",
    });
    return question;
});
exports.activateQuestion = activateQuestion;
/**
 * Deactivate a Question
 */
const deactivateQuestion = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield db_1.default.question.findUnique({ where: { id } });
    if (!previous)
        throw new Error("Question not found");
    const question = yield db_1.default.question.update({
        where: { id },
        data: {
            isActive: false,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        action: "DEACTIVATE",
        performedBy,
        details: {
            previousState: previous,
            notes: "Deactivation performed",
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "QUESTION",
        entityId: previous.questionId,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Deactivation performed",
    });
    return question;
});
exports.deactivateQuestion = deactivateQuestion;
/**
 * Get all Questions (optionally filter by isActive)
 */
const getAllQuestions = (isActive) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield db_1.default.question.findMany({
        where: isActive !== undefined ? { isActive } : {},
        orderBy: { createdAt: "desc" },
        include: {
            questionPaper: {
                include: {
                    board: true,
                    standard: true,
                    subject: true,
                },
            },
        },
    });
    return questions;
});
exports.getAllQuestions = getAllQuestions;
/**
 * Get Question by its database ID
 */
const getQuestionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield db_1.default.question.findUnique({ where: { id } });
    if (!question)
        throw new Error("Question not found");
    return question;
});
exports.getQuestionById = getQuestionById;
/**
 * Get all Questions by QuestionPaper ID (foreign key)
 */
const getQuestionsByQuestionPaperId = (questionPaperId) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield db_1.default.question.findMany({
        where: { questionPaperId },
        orderBy: { priority: "asc" },
    });
    return questions;
});
exports.getQuestionsByQuestionPaperId = getQuestionsByQuestionPaperId;
