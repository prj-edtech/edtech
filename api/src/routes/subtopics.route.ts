import { Router } from "express";
import * as subTopicController from "../controllers/subtopics.controller";

const subtopicRouter = Router();

// Create SubTopic
subtopicRouter.post("/", subTopicController.createSubTopic);

// Get all SubTopics for a Topic
subtopicRouter.get("/topic/:topicId", subTopicController.getSubTopicsByTopic);

// Get single SubTopic
subtopicRouter.get("/:id/content", subTopicController.getSingleSubtopic);

// Update SubTopic
subtopicRouter.put("/:subTopicId", subTopicController.updateSubTopic);

// Soft Delete SubTopic
subtopicRouter.delete("/:subTopicId", subTopicController.softDeleteSubTopic);

// Fetch all SubTopic
subtopicRouter.get("/", subTopicController.fetchAllSubtopics);

// Hard Delete SubTopic
subtopicRouter.delete("/:id/remove", subTopicController.removeSubtopic);

// Activate SubTopic
subtopicRouter.patch("/:id/activate", subTopicController.activeSubtopic);

// Approve SubTopic
subtopicRouter.patch("/:id/approve", subTopicController.approveSubtopic);

// Reject SubTopic
subtopicRouter.patch("/:id/disapprove", subTopicController.rejectSubtopic);

// Reset SubTopic
subtopicRouter.patch("/:id/reset", subTopicController.resetSubtopic);

export default subtopicRouter;
