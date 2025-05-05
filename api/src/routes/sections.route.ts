import { Router } from "express";
import * as sectionsController from "../controllers/sections.controller";

const router = Router();

// Create Section
router.post("/", sectionsController.createSection);

// Update Section
router.put("/:sectionId", sectionsController.updateSection);

// Get Sections by Subject
router.get("/by-subject/:subjectId", sectionsController.getSectionsBySubject);

// Soft Delete Section
router.delete("/:sectionId", sectionsController.softDeleteSection);

export default router;
