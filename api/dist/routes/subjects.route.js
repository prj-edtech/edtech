"use strict";
// api/src/routes/subjects.routes.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectsController = __importStar(require("../controllers/subjects.controller"));
const subjectRouter = (0, express_1.Router)();
// Create a Subject
subjectRouter.post("/", subjectsController.createSubject);
// Get all Subjects
subjectRouter.get("/", subjectsController.fetchAllSubjects);
// Get all active Subjects
subjectRouter.get("/active", subjectsController.fetchAllSubjects);
// Get all Subjects by Standard
subjectRouter.get("/:standardId/standard", subjectsController.fetchSubjectsByStandard);
// Get Subjects by Board + Standard
subjectRouter.get("/:boardId/:standardId", subjectsController.getSubjectsByBoardStandard);
// Update Subject (toggle isActive etc.)
subjectRouter.patch("/:id/activate", subjectsController.updateSubject);
// Soft Delete a Subject
subjectRouter.patch("/:id/deactivate", subjectsController.softDeleteSubject);
// Remove a Subject
subjectRouter.delete("/:id/remove", subjectsController.removeSubject);
exports.default = subjectRouter;
