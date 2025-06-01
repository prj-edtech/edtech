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
exports.removeTopic = exports.getAllActiveTopics = exports.getAllTopics = exports.softDeleteTopic = exports.getTopicsBySection = exports.updateTopic = exports.createTopic = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62");
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
const notifications_service_1 = require("./notifications.service");
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
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "TOPIC",
        entityId: topic.topicId,
        changeType: "CREATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.createdBy,
        createdBy: data.createdBy,
        notes: "Topic created by user",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.createdBy,
        eventType: "TOPIC",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: topic.topicId,
        title: "Topic Created",
        message: `New topic created`,
    });
    return topic;
});
exports.createTopic = createTopic;
const updateTopic = (topicId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const topic = yield db_1.default.topic.findUnique({ where: { topicId } });
    if (!topic)
        throw new Error("Topic not found.");
    const topicJson = topic.topicJson;
    const updatedJson = Object.assign(Object.assign({}, topicJson), { priority: (_a = data.priority) !== null && _a !== void 0 ? _a : topicJson.priority, attributes: (_b = data.attributes) !== null && _b !== void 0 ? _b : topicJson.attributes, isActive: (_c = data.isActive) !== null && _c !== void 0 ? _c : topicJson.isActive, updatedAt: new Date().toISOString(), updatedBy: data.updatedBy });
    const updatedTopic = yield db_1.default.topic.update({
        where: { topicId },
        data: {
            priority: data.priority,
            updatedBy: data.updatedBy,
            topicJson: updatedJson,
            isActive: data.isActive,
        },
    });
    // await createAuditLog({
    //   entityType: "Topic",
    //   entityId: topic.topicId,
    //   action: "UPDATE",
    //   performedBy: data.updatedBy,
    //   details: updatedJson,
    // });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "TOPIC",
        entityId: topic.topicId,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.updatedBy,
        createdBy: data.updatedBy,
        notes: "Topic updated by user",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.updatedBy,
        eventType: "TOPIC",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: topic.topicId,
        title: "Topic Updated",
        message: `New topic updated`,
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
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "TOPIC",
        entityId: topic.topicId,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: deletedBy,
        createdBy: deletedBy,
        notes: "Topic soft deleted by user",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: deletedBy,
        eventType: "TOPIC",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: topic.topicId,
        title: "Topic Deactivated",
        message: `New topic deactivated`,
    });
    return deletedTopic;
});
exports.softDeleteTopic = softDeleteTopic;
const getAllTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.topic.findMany({
        include: {
            section: true,
        },
    });
});
exports.getAllTopics = getAllTopics;
const getAllActiveTopics = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.topic.findMany({
        where: {
            isActive: true,
        },
        include: {
            section: true,
        },
    });
});
exports.getAllActiveTopics = getAllActiveTopics;
const removeTopic = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = db_1.default.topic.delete({
        where: {
            id,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "Topic",
        entityId: id,
        action: "DELETED",
        performedBy: performedBy,
        details: "Topic hard deleted by user",
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "TOPIC",
        entityId: id,
        changeType: "DELETE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Topic soft deleted by user",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "TOPIC",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: id,
        title: "Topic Deleted",
        message: `New topic deleted`,
    });
    return topic;
});
exports.removeTopic = removeTopic;
