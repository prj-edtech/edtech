import express from "express";
import * as standardController from "../controllers/standards.controller";

const standardRouter = express.Router();

// Create a new Standard
standardRouter.post("/", standardController.createStandard);

// Get all Standards
standardRouter.get("/", standardController.getAllStandards);

// Get all active Standards
standardRouter.get("/active", standardController.getAllActiveStandards);

// Get a Standard by ID
standardRouter.get("/:id", standardController.getStandardById);

// Get all Standard by board
standardRouter.get("/:boardId/board", standardController.getStandardByBoard);

// Update a Standard
standardRouter.put("/:id", standardController.updateStandard);

// Deactivate a Standard
standardRouter.patch("/:id/deactivate", standardController.deactivateStandard);

// Activate a Standard
standardRouter.patch("/:id/activate", standardController.activateStandard);

// Delete a Standard
standardRouter.delete("/:id", standardController.removeStandard);

export default standardRouter;
