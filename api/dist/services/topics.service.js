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
exports.getAllTopics = exports.softDeleteTopic = exports.getTopicsBySection = exports.updateTopic = exports.createTopic = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62");
const auditTrail_service_1 = require("./auditTrail.service");
const createTopic = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate section existence and isActive status
    const section = yield db_1.default.section.findUnique({
        where: { id: data.sectionId },
    });
    if (!section || !section.isActive) {
        throw new Error("Invalid or inactive section.");
    }
    const topicId = (0, base62_1.base62Encode)();
    // Build partitionKey and sortKey as per spec
    const partitionKey = `Topic#${section.partitionKey.split("#")[1]}#${section.partitionKey.split("#")[2]}`;
    const sortKey = `${section.sortKey.split("#")[0]}#${section.id}#${topicId}`;
    const topicJson = {
        partitionKey,
        sortKey,
        topicId,
        sectionId: data.sectionId,
        priority: data.priority,
        attributes: data.attributes,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
    };
    const topic = yield db_1.default.topic.create({
        data: {
            topicId,
            partitionKey,
            sortKey,
            sectionId: data.sectionId,
            priority: data.priority,
            isActive: true,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            topicJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "Topic",
        entityId: topic.topicId,
        action: "CREATE",
        performedBy: data.createdBy,
        details: topicJson,
    });
    return topic;
});
exports.createTopic = createTopic;
const updateTopic = (topicId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const topic = yield db_1.default.topic.findUnique({ where: { topicId } });
    if (!topic)
        throw new Error("Topic not found.");
    const updatedJson = Object.assign(Object.assign({}, topic.topicJson), { priority: (_a = data.priority) !== null && _a !== void 0 ? _a : topic.topicJson.priority, attributes: (_b = data.attributes) !== null && _b !== void 0 ? _b : topic.topicJson.attributes, updatedAt: new Date().toISOString(), updatedBy: data.updatedBy });
    const updatedTopic = yield db_1.default.topic.update({
        where: { topicId },
        data: {
            priority: data.priority,
            updatedBy: data.updatedBy,
            topicJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "Topic",
        entityId: topic.topicId,
        action: "UPDATE",
        performedBy: data.updatedBy,
        details: updatedJson,
    });
    return updatedTopic;
});
exports.updateTopic = updateTopic;
const getTopicsBySection = (sectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield db_1.default.topic.findMany({
        where: { sectionId, isActive: true },
        orderBy: { priority: "asc" },
    });
    return topics;
});
exports.getTopicsBySection = getTopicsBySection;
const softDeleteTopic = (topicId, deletedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield db_1.default.topic.findUnique({ where: { topicId } });
    if (!topic)
        throw new Error("Topic not found.");
    const updatedJson = Object.assign(Object.assign({}, topic.topicJson), { isActive: false, updatedAt: new Date().toISOString(), updatedBy: deletedBy });
    const deletedTopic = yield db_1.default.topic.update({
        where: { topicId },
        data: {
            isActive: false,
            updatedBy: deletedBy,
            topicJson: updatedJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "Topic",
        entityId: topic.topicId,
        action: "DELETE",
        performedBy: deletedBy,
        details: updatedJson,
    });
    return deletedTopic;
});
exports.softDeleteTopic = softDeleteTopic;
const getAllTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.topic.findMany();
});
exports.getAllTopics = getAllTopics;
