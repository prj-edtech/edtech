"use strict";
// api\src\services\sections.service.ts
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
exports.getAllActiveSections = exports.getAllSections = exports.removeSection = exports.softDeleteSection = exports.getSectionsBySubject = exports.updateSection = exports.createSection = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62");
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
// Helper to generate Section JSON
const generateSectionJson = (partitionKey, sortKey, sectionId, priority, displayName, isActive, createdAt, updatedAt, createdBy, updatedBy) => {
    return {
        partitionKey,
        sortKey,
        sectionId,
        priority,
        attributes: {
            displayName,
        },
        isActive,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
    };
};
// Create Section
const createSection = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield db_1.default.board.findUnique({ where: { id: data.boardId } });
    if (!board)
        throw new Error("Board not found");
    const standard = yield db_1.default.standard.findUnique({
        where: { id: data.standardId },
    });
    if (!standard)
        throw new Error("Standard not found");
    const subject = yield db_1.default.subject.findUnique({
        where: { id: data.subjectId },
    });
    if (!subject)
        throw new Error("Subject not found");
    const partitionKey = `Section#${board.sortKey}#${standard.sortKey}`;
    const existing = yield db_1.default.section.findFirst({
        where: {
            partitionKey,
            subjectId: data.subjectId,
            sectionJson: {
                path: ["attributes", "displayName"],
                equals: data.displayName,
            },
        },
    });
    if (existing)
        throw new Error("Section with this display name already exists in this subject");
    const sectionId = (0, base62_1.base62Encode)();
    const sortKey = `${subject.sortKey}#${sectionId}`;
    const now = new Date().toISOString();
    const sectionJson = generateSectionJson(partitionKey, sortKey, sectionId, data.priority, data.displayName, true, // isActive: true by default
    now, now, data.createdBy, data.createdBy);
    const section = yield db_1.default.section.create({
        data: {
            partitionKey,
            sortKey,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            boardId: data.boardId,
            standardId: data.standardId,
            subjectId: data.subjectId,
            sectionJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SECTION",
        entityId: section.id,
        action: "CREATED",
        performedBy: data.createdBy,
        details: { newState: section },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SECTION",
        entityId: section.id,
        changeType: "CREATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.createdBy,
        createdBy: data.createdBy,
        notes: "Section created without needing to be reviewed",
    });
    return section;
});
exports.createSection = createSection;
// Update Section
const updateSection = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch existing section
    const section = yield db_1.default.section.findUnique({
        where: { id: data.sectionId },
    });
    if (!section)
        throw new Error("Section not found");
    if (!section.sectionJson) {
        throw new Error("Section JSON data is missing");
    }
    // Typecast sectionJson safely
    const jsonData = section.sectionJson;
    // Update sectionJson fields
    const updatedJson = Object.assign(Object.assign({}, jsonData), { attributes: {
            displayName: data.displayName || jsonData.attributes.displayName,
        }, priority: data.priority !== undefined ? data.priority : jsonData.priority, isActive: data.isActive !== undefined ? data.isActive : jsonData.isActive, updatedAt: new Date().toISOString(), updatedBy: data.updatedBy });
    // Update Section
    const updatedSection = yield db_1.default.section.update({
        where: { id: data.sectionId },
        data: {
            sectionJson: updatedJson,
            isActive: data.isActive,
            updatedBy: data.updatedBy,
        },
    });
    // Log Audit
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SECTION",
        entityId: updatedSection.id,
        action: "UPDATED",
        performedBy: data.updatedBy,
        details: { newState: updatedSection },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SECTION",
        entityId: section.id,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.updatedBy,
        createdBy: data.updatedBy,
        notes: "Section updated without needing to be reviewed",
    });
    return updatedSection;
});
exports.updateSection = updateSection;
const getSectionsBySubject = (subjectId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch subject and validate
    const subject = yield db_1.default.subject.findUnique({
        where: { id: subjectId },
    });
    if (!subject)
        throw new Error("Subject not found");
    // Fetch active sections, ordered by priority scalar column
    const sections = yield db_1.default.section.findMany({
        where: {
            subjectId,
            isActive: true,
        },
        orderBy: {
            priority: "asc", // use the scalar column here
        },
    });
    return sections;
});
exports.getSectionsBySubject = getSectionsBySubject;
const softDeleteSection = (sectionId, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch section
    const section = yield db_1.default.section.findUnique({
        where: { id: sectionId },
    });
    if (!section)
        throw new Error("Section not found");
    // Type guard or assertion
    const sectionJson = section.sectionJson;
    if (!sectionJson)
        throw new Error("Invalid section JSON");
    // Update isActive in sectionJson
    const updatedJson = Object.assign(Object.assign({}, sectionJson), { isActive: false, updatedAt: new Date().toISOString(), updatedBy: performedBy });
    // Soft delete section
    const updatedSection = yield db_1.default.section.update({
        where: { id: sectionId },
        data: {
            isActive: false,
            sectionJson: updatedJson,
            updatedBy: performedBy,
        },
    });
    // Log Audit
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SECTION",
        entityId: sectionId,
        action: "SOFT_DELETED",
        performedBy,
        details: { previousState: section, newState: updatedSection },
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SECTION",
        entityId: section.id,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Section soft deleted without needing to be reviewed",
    });
    return updatedSection;
});
exports.softDeleteSection = softDeleteSection;
const removeSection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const section = yield db_1.default.section.delete({
        where: {
            id,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SECTION",
        entityId: id,
        action: "DELETED",
        performedBy: "admin",
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "SECTION",
        entityId: section.id,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: "user",
        createdBy: "user",
        notes: "Section hard deleted without needing to be reviewed",
    });
    return section;
});
exports.removeSection = removeSection;
const getAllSections = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.section.findMany({
        include: {
            board: true,
            standard: true,
            subject: true,
        },
    });
});
exports.getAllSections = getAllSections;
const getAllActiveSections = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.section.findMany({
        include: {
            board: true,
            standard: true,
            subject: true,
        },
    });
});
exports.getAllActiveSections = getAllActiveSections;
