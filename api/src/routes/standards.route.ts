import express from "express";
import * as standardController from "../controllers/standards.controller";

const standardRouter = express.Router();

// Create a new Standard
standardRouter.post("/standards", standardController.createStandard);

// Get all Standards
standardRouter.get("/standards", standardController.getAllStandards);

// Get a Standard by ID
standardRouter.get("/standards/:id", standardController.getStandardById);

// Update a Standard
standardRouter.put("/standards/:id", standardController.updateStandard);

// Deactivate a Standard
standardRouter.patch(
  "/standards/:id/deactivate",
  standardController.deactivateStandard
);

export default standardRouter;
