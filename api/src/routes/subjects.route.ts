// api/src/routes/subjects.routes.ts

import { Router } from "express";
import * as subjectsController from "../controllers/subjects.controller";

const subjectRouter = Router();

// Create a Subject
subjectRouter.post("/", subjectsController.createSubject);

// Get Subjects by Board + Standard
subjectRouter.get(
  "/:boardId/:standardId",
  subjectsController.getSubjectsByBoardStandard
);

// Update Subject (toggle isActive etc.)
subjectRouter.patch("/:id", subjectsController.updateSubject);

// Soft Delete a Subject
subjectRouter.delete("/:id", subjectsController.softDeleteSubject);

export default subjectRouter;
