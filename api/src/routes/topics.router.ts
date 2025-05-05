import { Router } from "express";
import * as topicsController from "../controllers/topics.controller";

const router = Router();

// POST /api/topics
router.post("/", topicsController.handleCreateTopic);

// PUT /api/topics/:topicId
router.put("/:topicId", topicsController.handleUpdateTopic);

// GET /api/topics/section/:sectionId
router.get("/section/:sectionId", topicsController.handleGetTopicsBySection);

// DELETE /api/topics/:topicId
router.delete("/:topicId", topicsController.handleSoftDeleteTopic);

export default router;
