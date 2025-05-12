import { Router } from "express";
import * as sectionsController from "../controllers/sections.controller";

const router = Router();

// Create Section
router.post("/", sectionsController.createSection);

// Get all Sections
router.get("/", sectionsController.fetchAllSections);

// Update Section
router.put("/:sectionId", sectionsController.updateSection);

// Get Sections by Subject
router.get("/by-subject/:subjectId", sectionsController.getSectionsBySubject);

// Soft Delete Section
router.patch("/:sectionId", sectionsController.softDeleteSection);

//  Remove Section
router.delete("/:id", sectionsController.removeSection);

export default router;
