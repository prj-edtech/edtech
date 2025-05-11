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
exports.getAllSubtopics = exports.softDeleteSubTopic = exports.updateSubTopic = exports.getSubTopicsByTopic = exports.createSubTopic = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62");
const auditTrail_service_1 = require("./auditTrail.service");
const createSubTopic = (_a) => __awaiter(void 0, [_a], void 0, function* ({ boardCode, standardCode, subjectName, sectionId, topicId, displayName, priority, contentPath, createdBy, }) {
    // Generate Base62 subtopic ID
    const subTopicId = (0, base62_1.base62Encode)();
    // Build partition and sort keys
    const partitionKey = `SubTopic#${boardCode}#${standardCode}`;
    const sortKey = `${subjectName}#${sectionId}#${topicId}#${subTopicId}`;
    const priorityNumber = Number(priority);
    // Assemble strict production JSON
    const subTopicJson = {
        partitionKey,
        sortKey,
        topicId,
        sectionId,
        subTopicId,
        subtopicContentPath: contentPath,
        priority,
        attributes: { displayName },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy,
        updatedBy: createdBy,
    };
    // Persist to DB
    const subTopic = yield db_1.default.subTopic.create({
        data: {
            partitionKey,
            sortKey,
            subTopicId,
            topicId,
            sectionId,
            priority: priorityNumber,
            subtopicContentPath: contentPath, // added missing field
            createdBy,
            updatedBy: createdBy,
            subTopicJson,
        },
    });
    // Audit trail
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SubTopic",
        entityId: subTopic.id,
        action: "CREATE",
        performedBy: createdBy,
        details: subTopicJson,
    });
    return subTopic;
});
exports.createSubTopic = createSubTopic;
const getSubTopicsByTopic = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.subTopic.findMany({
        where: { topicId, isActive: true },
        orderBy: { priority: "asc" },
    });
});
exports.getSubTopicsByTopic = getSubTopicsByTopic;
const updateSubTopic = (_a) => __awaiter(void 0, [_a], void 0, function* ({ subTopicId, displayName, priority, contentPath, updatedBy, }) {
    const existing = yield db_1.default.subTopic.findUnique({
        where: { subTopicId },
    });
    if (!existing)
        throw new Error("SubTopic not found");
    // Update JSON
    const updatedJson = Object.assign(Object.assign({}, existing.subTopicJson), { subtopicContentPath: contentPath, priority, attributes: { displayName }, updatedAt: new Date().toISOString(), updatedBy });
    const updatedSubTopic = yield db_1.default.subTopic.update({
        where: { subTopicId },
        data: {
            priority,
            updatedBy,
            subTopicJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SubTopic",
        entityId: existing.id,
        action: "UPDATE",
        performedBy: updatedBy,
        details: updatedJson,
    });
    return updatedSubTopic;
});
exports.updateSubTopic = updateSubTopic;
const softDeleteSubTopic = (subTopicId, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.default.subTopic.findUnique({
        where: { subTopicId },
    });
    if (!existing)
        throw new Error("SubTopic not found");
    // Update isActive & JSON
    const updatedJson = Object.assign(Object.assign({}, existing.subTopicJson), { isActive: false, updatedAt: new Date().toISOString(), updatedBy: performedBy });
    yield db_1.default.subTopic.update({
        where: { subTopicId },
        data: {
            isActive: false,
            updatedBy: performedBy,
            subTopicJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "SubTopic",
        entityId: existing.id,
        action: "SOFT_DELETE",
        performedBy,
        details: updatedJson,
    });
});
exports.softDeleteSubTopic = softDeleteSubTopic;
const getAllSubtopics = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.subTopic.findMany();
});
exports.getAllSubtopics = getAllSubtopics;
