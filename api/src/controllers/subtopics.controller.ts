import { Request, Response } from "express";
import * as subTopicService from "../services/subtopics.service";

// Create SubTopic
export const createSubTopic = async (req: Request, res: Response) => {
  try {
    const {
      boardCode,
      standardCode,
      subjectName,
      sectionId,
      topicId,
      displayName,
      priority,
      contentPath,
      createdBy,
    } = req.body;

    // Validation (light in controller — full schema validation can be added later via middleware like Zod or Joi)
    if (!boardCode || !standardCode || !subjectName || !sectionId || !topicId)
      res.status(400).json({ message: "Missing required fields" });

    // Call service
    const subTopic = await subTopicService.createSubTopic({
      boardCode,
      standardCode,
      subjectName,
      sectionId,
      topicId,
      displayName,
      priority,
      contentPath,
      createdBy,
    });

    res.status(201).json(subTopic);
  } catch (error: any) {
    console.error("Create SubTopic Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get SubTopics by Topic
export const getSubTopicsByTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!topicId)
      res.status(400).json({ message: "Missing topicId parameter" });

    const subTopics = await subTopicService.getSubTopicsByTopic(topicId);

    res.status(200).json(subTopics);
  } catch (error: any) {
    console.error("Get SubTopics Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update SubTopic
export const updateSubTopic = async (req: Request, res: Response) => {
  try {
    const { subTopicId } = req.params;
    const { displayName, priority, contentPath, updatedBy } = req.body;

    if (!subTopicId)
      res.status(400).json({ message: "Missing subTopicId parameter" });

    const updatedSubTopic = await subTopicService.updateSubTopic({
      subTopicId,
      displayName,
      priority,
      contentPath,
      updatedBy,
    });

    res.status(200).json(updatedSubTopic);
  } catch (error: any) {
    console.error("Update SubTopic Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete SubTopic
export const softDeleteSubTopic = async (req: Request, res: Response) => {
  try {
    const { subTopicId } = req.params;
    const { performedBy } = req.body;

    if (!subTopicId)
      res.status(400).json({ message: "Missing subTopicId parameter" });

    await subTopicService.softDeleteSubTopic(subTopicId, performedBy);

    res.status(200).json({ message: "SubTopic soft deleted successfully" });
  } catch (error: any) {
    console.error("Soft Delete SubTopic Error:", error);
    res.status(500).json({ message: error.message });
  }
};
