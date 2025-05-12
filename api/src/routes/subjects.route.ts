// api/src/routes/subjects.routes.ts

import { Router } from "express";
import * as subjectsController from "../controllers/subjects.controller";

const subjectRouter = Router();

// Create a Subject
subjectRouter.post("/", subjectsController.createSubject);

// Get all Subjects
subjectRouter.get("/", subjectsController.fetchAllSubjects);

// Get Subjects by Board + Standard
subjectRouter.get(
  "/:boardId/:standardId",
  subjectsController.getSubjectsByBoardStandard
);

// Update Subject (toggle isActive etc.)
subjectRouter.patch("/:id/activate", subjectsController.updateSubject);

// Soft Delete a Subject
subjectRouter.patch("/:id/deactivate", subjectsController.softDeleteSubject);

// Remove a Subject
subjectRouter.delete("/:id/remove", subjectsController.removeSubject);

export default subjectRouter;
