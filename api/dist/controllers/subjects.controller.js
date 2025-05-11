"use strict";
// api/src/controllers/subjects.controller.ts
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
exports.fetchAllSubjects = exports.softDeleteSubject = exports.updateSubject = exports.getSubjectsByBoardStandard = exports.createSubject = void 0;
const subjectService = __importStar(require("../services/subjects.service"));
// Create Subject Controller
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortKey, boardId, standardId, createdBy } = req.body;
        // Validate request body presence
        if (!sortKey || !boardId || !standardId || !createdBy) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const subject = yield subjectService.createSubject({
            sortKey,
            boardId,
            standardId,
            createdBy,
        });
        res.status(201).json(subject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createSubject = createSubject;
// Get Subjects By Board + Standard
const getSubjectsByBoardStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, standardId } = req.params;
        if (!boardId || !standardId) {
            res.status(400).json({ message: "Missing boardId or standardId" });
        }
        const subjects = yield subjectService.getSubjectsByBoardStandard(boardId, standardId);
        res.status(200).json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSubjectsByBoardStandard = getSubjectsByBoardStandard;
// Update Subject (isActive)
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isActive, updatedBy } = req.body;
        if (!id || !updatedBy) {
            res.status(400).json({ message: "Missing id or updatedBy" });
        }
        const updatedSubject = yield subjectService.updateSubject(id, {
            isActive,
            updatedBy,
        });
        res.status(200).json(updatedSubject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateSubject = updateSubject;
// Soft Delete Subject
const softDeleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!id || !performedBy) {
            res.status(400).json({ message: "Missing id or performedBy" });
        }
        const deletedSubject = yield subjectService.softDeleteSubject(id, performedBy);
        res.status(200).json(deletedSubject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.softDeleteSubject = softDeleteSubject;
const fetchAllSubjects = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield subjectService.getAllSubjects();
        res.status(200).json({ data: subjects });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.fetchAllSubjects = fetchAllSubjects;
