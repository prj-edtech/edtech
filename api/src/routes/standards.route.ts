import express from "express";
import * as standardController from "../controllers/standards.controller";

const standardRouter = express.Router();

// Create a new Standard
standardRouter.post("/", standardController.createStandard);

// Get all Standards
standardRouter.get("/", standardController.getAllStandards);

// Get a Standard by ID
standardRouter.get("/:id", standardController.getStandardById);

// Update a Standard
standardRouter.put("/:id", standardController.updateStandard);

// Deactivate a Standard
standardRouter.patch("/:id/deactivate", standardController.deactivateStandard);

export default standardRouter;
