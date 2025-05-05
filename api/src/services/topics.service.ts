import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";

export const createTopic = async (data: {
  boardId: string;
  standardId: string;
  subjectId: string;
  sectionId: string;
  priority: number;
  attributes: any;
  createdBy: string;
}) => {
  // Validate section existence and isActive status
  const section = await prisma.section.findUnique({
    where: { id: data.sectionId },
  });

  if (!section || !section.isActive) {
    throw new Error("Invalid or inactive section.");
  }

  const topicId = base62Encode();

  // Build partitionKey and sortKey as per spec
  const partitionKey = `Topic#${section.partitionKey.split("#")[1]}#${
    section.partitionKey.split("#")[2]
  }`;
  const sortKey = `${section.sortKey.split("#")[0]}#${section.id}#${topicId}`;

  const topicJson = {
    partitionKey,
    sortKey,
    topicId,
    sectionId: data.sectionId,
    priority: data.priority,
    attributes: data.attributes,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
    updatedBy: data.createdBy,
  };

  const topic = await prisma.topic.create({
    data: {
      topicId,
      partitionKey,
      sortKey,
      sectionId: data.sectionId,
      priority: data.priority,
      isActive: true,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      topicJson,
    },
  });

  await createAuditLog({
    entityType: "Topic",
    entityId: topic.topicId,
    action: "CREATE",
    performedBy: data.createdBy,
    details: topicJson,
  });

  return topic;
};

export const updateTopic = async (
  topicId: string,
  data: {
    priority?: number;
    attributes?: any;
    updatedBy: string;
  }
) => {
  const topic = await prisma.topic.findUnique({ where: { topicId } });

  if (!topic) throw new Error("Topic not found.");

  const updatedJson = {
    ...(topic.topicJson as Record<string, any>),
    priority:
      data.priority ?? (topic.topicJson as Record<string, any>).priority,
    attributes:
      data.attributes ?? (topic.topicJson as Record<string, any>).attributes,
    updatedAt: new Date().toISOString(),
    updatedBy: data.updatedBy,
  };

  const updatedTopic = await prisma.topic.update({
    where: { topicId },
    data: {
      priority: data.priority,
      updatedBy: data.updatedBy,
      topicJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "Topic",
    entityId: topic.topicId,
    action: "UPDATE",
    performedBy: data.updatedBy,
    details: updatedJson,
  });

  return updatedTopic;
};

export const getTopicsBySection = async (sectionId: string) => {
  const topics = await prisma.topic.findMany({
    where: { sectionId, isActive: true },
    orderBy: { priority: "asc" },
  });

  return topics;
};

export const softDeleteTopic = async (topicId: string, deletedBy: string) => {
  const topic = await prisma.topic.findUnique({ where: { topicId } });
  if (!topic) throw new Error("Topic not found.");

  const updatedJson = {
    ...(topic.topicJson as Record<string, any>),
    isActive: false,
    updatedAt: new Date().toISOString(),
    updatedBy: deletedBy,
  };

  const deletedTopic = await prisma.topic.update({
    where: { topicId },
    data: {
      isActive: false,
      updatedBy: deletedBy,
      topicJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "Topic",
    entityId: topic.topicId,
    action: "DELETE",
    performedBy: deletedBy,
    details: updatedJson,
  });

  return deletedTopic;
};
