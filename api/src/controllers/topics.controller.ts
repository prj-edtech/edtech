import { Request, Response } from "express";
import {
  createTopic,
  updateTopic,
  getTopicsBySection,
  softDeleteTopic,
} from "../services/topics.service";

// Create a new topic
export const handleCreateTopic = async (req: Request, res: Response) => {
  try {
    const {
      boardId,
      standardId,
      subjectId,
      sectionId,
      priority,
      attributes,
      createdBy,
    } = req.body;

    const topic = await createTopic({
      boardId,
      standardId,
      subjectId,
      sectionId,
      priority,
      attributes,
      createdBy,
    });

    res.status(201).json({
      message: "Topic created successfully.",
      data: topic,
    });
  } catch (error: any) {
    console.error("Error creating topic:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a topic
export const handleUpdateTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { priority, attributes, updatedBy } = req.body;

    const updatedTopic = await updateTopic(topicId, {
      priority,
      attributes,
      updatedBy,
    });

    res.status(200).json({
      message: "Topic updated successfully.",
      data: updatedTopic,
    });
  } catch (error: any) {
    console.error("Error updating topic:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all topics by section
export const handleGetTopicsBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    const topics = await getTopicsBySection(sectionId);

    res.status(200).json({
      message: "Topics fetched successfully.",
      data: topics,
    });
  } catch (error: any) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a topic
export const handleSoftDeleteTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { deletedBy } = req.body;

    const deletedTopic = await softDeleteTopic(topicId, deletedBy);

    res.status(200).json({
      message: "Topic soft-deleted successfully.",
      data: deletedTopic,
    });
  } catch (error: any) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ message: error.message });
  }
};
