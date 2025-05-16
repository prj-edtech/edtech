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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopic = exports.fetchAllActiveTopics = exports.fetchAllTopics = exports.handleSoftDeleteTopic = exports.handleGetTopicsBySection = exports.handleUpdateTopic = exports.handleCreateTopic = void 0;
const topics_service_1 = require("../services/topics.service");
// Create a new topic
const handleCreateTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, standardId, subjectId, sectionId, priority, attributes, createdBy, } = req.body;
        const topic = yield (0, topics_service_1.createTopic)({
            boardId,
            standardId,
            subjectId,
            sectionId,
            priority,
            attributes,
            createdBy,
        });
        res.status(201).json({
            message: "Topic created successfully.",
            data: topic,
        });
    }
    catch (error) {
        console.error("Error creating topic:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.handleCreateTopic = handleCreateTopic;
// Update a topic
const handleUpdateTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        const { priority, attributes, updatedBy, isActive } = req.body;
        const updatedTopic = yield (0, topics_service_1.updateTopic)(topicId, {
            priority,
            attributes,
            updatedBy,
            isActive,
        });
        res.status(200).json({
            message: "Topic updated successfully.",
            data: updatedTopic,
        });
    }
    catch (error) {
        console.error("Error updating topic:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.handleUpdateTopic = handleUpdateTopic;
// Get all topics by section
const handleGetTopicsBySection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId } = req.params;
        const topics = yield (0, topics_service_1.getTopicsBySection)(sectionId);
        res.status(200).json({
            message: "Topics fetched successfully.",
            data: topics,
        });
    }
    catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.handleGetTopicsBySection = handleGetTopicsBySection;
// Soft delete a topic
const handleSoftDeleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        const { deletedBy } = req.body;
        const deletedTopic = yield (0, topics_service_1.softDeleteTopic)(topicId, deletedBy);
        res.status(200).json({
            message: "Topic soft-deleted successfully.",
            data: deletedTopic,
        });
    }
    catch (error) {
        console.error("Error deleting topic:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.handleSoftDeleteTopic = handleSoftDeleteTopic;
// Get all topics
const fetchAllTopics = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield (0, topics_service_1.getAllTopics)();
        res.status(200).json({ data: topics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.fetchAllTopics = fetchAllTopics;
// Get all active topics
const fetchAllActiveTopics = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield (0, topics_service_1.getAllActiveTopics)();
        res.status(200).json({ data: topics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.fetchAllActiveTopics = fetchAllActiveTopics;
// Permanently remove a topic
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(404).json({
                success: false,
                message: "ID not found in params or incorrect",
            });
        }
        const topic = yield (0, topics_service_1.removeTopic)(id);
        res
            .status(200)
            .json({ success: true, data: topic, message: "Topic deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTopic = deleteTopic;
