// api/src/routes/subjects.routes.ts

import { Router } from "express";
import * as subjectsController from "../controllers/subjects.controller";

const router = Router();

// Create a Subject
router.post("/", subjectsController.createSubject);

// Get Subjects by Board + Standard
router.get(
  "/:boardId/:standardId",
  subjectsController.getSubjectsByBoardStandard
);

// Update Subject (toggle isActive etc.)
router.patch("/:id", subjectsController.updateSubject);

// Soft Delete a Subject
router.delete("/:id", subjectsController.softDeleteSubject);

export default router;
