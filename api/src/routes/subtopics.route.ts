import { Router } from "express";
import * as subTopicController from "../controllers/subtopics.controller";

const subtopicRouter = Router();

// Create SubTopic
subtopicRouter.post("/", subTopicController.createSubTopic);

// Get all SubTopics for a Topic
subtopicRouter.get("/topic/:topicId", subTopicController.getSubTopicsByTopic);

// Update SubTopic
subtopicRouter.put("/:subTopicId", subTopicController.updateSubTopic);

// Soft Delete SubTopic
subtopicRouter.delete("/:subTopicId", subTopicController.softDeleteSubTopic);

export default subtopicRouter;
