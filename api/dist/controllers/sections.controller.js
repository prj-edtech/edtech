"use strict";
// api\src\controllers\sections.controller.ts
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
exports.fetchAllSections = exports.softDeleteSection = exports.getSectionsBySubject = exports.updateSection = exports.createSection = void 0;
const sectionService = __importStar(require("../services/sections.service"));
// Create Section
const createSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortKey, boardId, standardId, subjectId, priority, displayName, createdBy, } = req.body;
        if (!sortKey ||
            !boardId ||
            !standardId ||
            !subjectId ||
            priority === undefined ||
            !displayName ||
            !createdBy) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const section = yield sectionService.createSection({
            sortKey,
            boardId,
            standardId,
            subjectId,
            priority,
            displayName,
            createdBy,
        });
        res.status(201).json({ message: "Section created successfully", section });
    }
    catch (error) {
        console.error("Create Section Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.createSection = createSection;
// Update Section
const updateSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId } = req.params;
        const { displayName, priority, isActive, updatedBy } = req.body;
        if (!sectionId || !updatedBy) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const updatedSection = yield sectionService.updateSection({
            sectionId,
            displayName,
            priority,
            isActive,
            updatedBy,
        });
        res.status(200).json({
            message: "Section updated successfully",
            section: updatedSection,
        });
    }
    catch (error) {
        console.error("Update Section Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.updateSection = updateSection;
// Get Sections by Subject
const getSectionsBySubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId } = req.params;
        if (!subjectId) {
            res.status(400).json({ message: "Missing subjectId" });
        }
        const sections = yield sectionService.getSectionsBySubject(subjectId);
        res.status(200).json({ sections });
    }
    catch (error) {
        console.error("Get Sections Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getSectionsBySubject = getSectionsBySubject;
// Soft Delete Section
const softDeleteSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId } = req.params;
        const { performedBy } = req.body;
        if (!sectionId || !performedBy) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const deletedSection = yield sectionService.softDeleteSection(sectionId, performedBy);
        res.status(200).json({
            message: "Section soft-deleted successfully",
            section: deletedSection,
        });
    }
    catch (error) {
        console.error("Soft Delete Section Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.softDeleteSection = softDeleteSection;
const fetchAllSections = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sections = yield sectionService.getAllSections();
        res.status(200).json({ data: sections });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.fetchAllSections = fetchAllSections;
