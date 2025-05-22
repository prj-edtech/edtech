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

// Get all subtopics
export const fetchAllSubtopics = async (_req: Request, res: Response) => {
  try {
    const subtopics = await subTopicService.getAllSubtopics();

    res.status(200).json({ data: subtopics });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Remove  a subtopic
export const removeSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.removeSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Set subtopic to active
export const activeSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.activeSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Set subtopic to active
export const deactiveSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.deactiveSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch single subtopic
export const getSingleSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.getSingleSubtopic(id);

    res.status(200).json({ data: subtopics });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Approve subtopic
export const approveSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.approveSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics, message: "Subtopic approved" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Reset subtopic
export const resetSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.resetSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics, message: "Subtopic reset" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Reject subtopic
export const rejectSubtopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { performedBy } = req.body;

    if (!id) {
      res.status(404).json({ message: "ID is invalid or do not exists" });
    }

    const subtopics = await subTopicService.rejectSubtopic(id, performedBy);

    res.status(200).json({ data: subtopics, message: "Subtopic disapproved" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
