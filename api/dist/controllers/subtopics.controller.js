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
exports.rejectSubtopic = exports.resetSubtopic = exports.approveSubtopic = exports.getSingleSubtopic = exports.deactiveSubtopic = exports.activeSubtopic = exports.removeSubtopic = exports.fetchAllSubtopics = exports.softDeleteSubTopic = exports.updateSubTopic = exports.getSubTopicsByTopic = exports.createSubTopic = void 0;
const subTopicService = __importStar(require("../services/subtopics.service"));
// Create SubTopic
const createSubTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardCode, standardCode, subjectName, sectionId, topicId, displayName, priority, contentPath, createdBy, } = req.body;
        // Validation (light in controller — full schema validation can be added later via middleware like Zod or Joi)
        if (!boardCode || !standardCode || !subjectName || !sectionId || !topicId)
            res.status(400).json({ message: "Missing required fields" });
        // Call service
        const subTopic = yield subTopicService.createSubTopic({
            boardCode,
            standardCode,
            subjectName,
            sectionId,
            topicId,
            displayName,
            priority,
            contentPath,
            createdBy,
        });
        res.status(201).json(subTopic);
    }
    catch (error) {
        console.error("Create SubTopic Error:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.createSubTopic = createSubTopic;
// Get SubTopics by Topic
const getSubTopicsByTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        if (!topicId)
            res.status(400).json({ message: "Missing topicId parameter" });
        const subTopics = yield subTopicService.getSubTopicsByTopic(topicId);
        res.status(200).json(subTopics);
    }
    catch (error) {
        console.error("Get SubTopics Error:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.getSubTopicsByTopic = getSubTopicsByTopic;
// Update SubTopic
const updateSubTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subTopicId } = req.params;
        const { displayName, priority, contentPath, updatedBy } = req.body;
        if (!subTopicId)
            res.status(400).json({ message: "Missing subTopicId parameter" });
        const updatedSubTopic = yield subTopicService.updateSubTopic({
            subTopicId,
            displayName,
            priority,
            contentPath,
            updatedBy,
        });
        res.status(200).json(updatedSubTopic);
    }
    catch (error) {
        console.error("Update SubTopic Error:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.updateSubTopic = updateSubTopic;
// Soft Delete SubTopic
const softDeleteSubTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subTopicId } = req.params;
        const { performedBy } = req.body;
        if (!subTopicId)
            res.status(400).json({ message: "Missing subTopicId parameter" });
        yield subTopicService.softDeleteSubTopic(subTopicId, performedBy);
        res.status(200).json({ message: "SubTopic soft deleted successfully" });
    }
    catch (error) {
        console.error("Soft Delete SubTopic Error:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.softDeleteSubTopic = softDeleteSubTopic;
// Get all subtopics
const fetchAllSubtopics = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subtopics = yield subTopicService.getAllSubtopics();
        res.status(200).json({ data: subtopics });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.fetchAllSubtopics = fetchAllSubtopics;
// Remove  a subtopic
const removeSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.removeSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeSubtopic = removeSubtopic;
// Set subtopic to active
const activeSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.activeSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.activeSubtopic = activeSubtopic;
// Set subtopic to inactive
const deactiveSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.deactiveSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deactiveSubtopic = deactiveSubtopic;
// Fetch single subtopic
const getSingleSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.getSingleSubtopic(id);
        res.status(200).json({ data: subtopics });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSingleSubtopic = getSingleSubtopic;
// Approve subtopic
const approveSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.approveSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics, message: "Subtopic approved" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.approveSubtopic = approveSubtopic;
// Reset subtopic
const resetSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.resetSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics, message: "Subtopic reset" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.resetSubtopic = resetSubtopic;
// Reject subtopic
const rejectSubtopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id) {
            res.status(404).json({ message: "ID is invalid or do not exists" });
        }
        const subtopics = yield subTopicService.rejectSubtopic(id, performedBy);
        res.status(200).json({ data: subtopics, message: "Subtopic disapproved" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.rejectSubtopic = rejectSubtopic;
