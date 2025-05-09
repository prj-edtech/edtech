import { Router } from "express";
import * as topicsController from "../controllers/topics.controller";

const topicRouter = Router();

// POST /api/topics
topicRouter.post("/", topicsController.handleCreateTopic);

// PUT /api/topics/:topicId
topicRouter.put("/:topicId", topicsController.handleUpdateTopic);

// GET /api/topics/section/:sectionId
topicRouter.get(
  "/section/:sectionId",
  topicsController.handleGetTopicsBySection
);

// DELETE /api/topics/:topicId
topicRouter.delete("/:topicId", topicsController.handleSoftDeleteTopic);

// GET /api/topics/
topicRouter.get("/", topicsController.fetchAllTopics);

export default topicRouter;
