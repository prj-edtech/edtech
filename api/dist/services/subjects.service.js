"use strict";
// api\src\services\subjects.service.ts
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
exports.getSubjectsByStandard = exports.getAllActiveSubjects = exports.getAllSubjects = exports.removeSubject = exports.softDeleteSubject = exports.updateSubject = exports.getSubjectsByBoardStandard = exports.createSubject = void 0;
const db_1 = __importDefault(require("../config/db"));
const jsonBuilder_1 = require("../utils/jsonBuilder");
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
const notifications_service_1 = require("./notifications.service");
// Create Subject
const createSubject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch board and standard details
    const board = yield db_1.default.board.findUnique({ where: { id: data.boardId } });
    if (!board)
        throw new Error("Board not found");
    const standard = yield db_1.default.standard.findUnique({
        where: { id: data.standardId },
    });
    if (!standard)
        throw new Error("Standard not found");
    // Construct partitionKey
    const partitionKey = `Subject#${board.sortKey}#${standard.sortKey}`;
    // Duplicate check
    const existing = yield db_1.default.subject.findUnique({
        where: {
            partitionKey_sortKey: {
                partitionKey,
                sortKey: data.sortKey,
            },
        },
    });
    if (existing)
        throw new Error("Subject already exists in this Board + Standard");
    // Build JSON
    const subjectJson = (0, jsonBuilder_1.generateSubjectJson)(partitionKey, data.sortKey, data.createdBy, data.createdBy);
    // Create Subject
    const subject = yield db_1.default.subject.create({
        data: {
            partitionKey,
            sortKey: data.sortKey,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            boardId: data.boardId,
            standardId: data.standardId,
            subjectJson,
        },
    });
    // Log Audit
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SUBJECT",
        entityId: subject.id,
        action: "CREATED",
        performedBy: data.createdBy,
        details: { newState: subject },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SUBJECT",
        entityId: subject.id,
        changeType: "CREATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.createdBy,
        createdBy: data.createdBy,
        notes: "Subject created without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.createdBy,
        eventType: "SUBJECT",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: subject.id,
        title: "Subject Created",
        message: `New subject created`,
    });
    return subject;
});
exports.createSubject = createSubject;
const getSubjectsByBoardStandard = (boardId, standardId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.subject.findMany({
        where: {
            boardId,
            standardId,
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.getSubjectsByBoardStandard = getSubjectsByBoardStandard;
const updateSubject = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existing = yield db_1.default.subject.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Subject not found");
    // Type guard: cast or fallback
    const existingJson = (_a = existing.subjectJson) !== null && _a !== void 0 ? _a : {};
    const updatedJson = Object.assign(Object.assign({}, existingJson), { isActive: (_b = data.isActive) !== null && _b !== void 0 ? _b : existing.isActive, updatedAt: new Date().toISOString(), updatedBy: data.updatedBy });
    const updatedSubject = yield db_1.default.subject.update({
        where: { id },
        data: {
            isActive: true,
            updatedBy: data.updatedBy,
            subjectJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SUBJECT",
        entityId: id,
        action: "UPDATED",
        performedBy: data.updatedBy,
        details: {
            previousState: existing,
            newState: updatedSubject,
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SUBJECT",
        entityId: id,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.updatedBy,
        createdBy: data.updatedBy,
        notes: "Subject updated without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.updatedBy,
        eventType: "SUBJECT",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: id,
        title: "Subject Updated",
        message: `New subject updated`,
    });
    return updatedSubject;
});
exports.updateSubject = updateSubject;
const softDeleteSubject = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existing = yield db_1.default.subject.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Subject not found");
    const existingJson = (_a = existing.subjectJson) !== null && _a !== void 0 ? _a : {};
    const updatedJson = Object.assign(Object.assign({}, existingJson), { isActive: false, updatedAt: new Date().toISOString(), updatedBy: performedBy });
    const updatedSubject = yield db_1.default.subject.update({
        where: { id },
        data: {
            isActive: false,
            updatedBy: performedBy,
            subjectJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SUBJECT",
        entityId: id,
        action: "DELETED",
        performedBy,
        details: {
            previousState: existing,
            newState: updatedSubject,
            notes: "Soft delete via isActive false",
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SUBJECT",
        entityId: id,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Subject soft deleted without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "SUBJECT",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: id,
        title: "Subject Deactivated",
        message: `New subject deactivated`,
    });
    return updatedSubject;
});
exports.softDeleteSubject = softDeleteSubject;
const removeSubject = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSubject = yield db_1.default.subject.delete({
        where: {
            id,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SUBJECT",
        entityId: id,
        action: "DELETED",
        performedBy: performedBy,
        details: {
            notes: "Subject has been removed permanently",
        },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SUBJECT",
        entityId: id,
        changeType: "DELETE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Subject hard deleted without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "SUBJECT",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: id,
        title: "Subject Deleted",
        message: `New subject deleted`,
    });
    return deletedSubject;
});
exports.removeSubject = removeSubject;
const getAllSubjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.subject.findMany({
        include: {
            board: true,
            standard: true,
        },
    });
});
exports.getAllSubjects = getAllSubjects;
const getAllActiveSubjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.subject.findMany({
        where: {
            isActive: true,
        },
    });
});
exports.getAllActiveSubjects = getAllActiveSubjects;
const getSubjectsByStandard = (standardId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.subject.findMany({
        where: {
            standardId,
            isActive: true,
        },
    });
});
exports.getSubjectsByStandard = getSubjectsByStandard;
