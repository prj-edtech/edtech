import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";
import { createNotification } from "./notifications.service";

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

  await createChangeLog({
    entityType: "TOPIC",
    entityId: topic.topicId,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    notes: "Topic created by user",
  });

  await createNotification({
    userId: data.createdBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: topic.topicId,
    title: "Topic Created",
    message: `New topic created`,
  });

  return topic;
};

export const updateTopic = async (
  topicId: string,
  data: {
    priority?: number;
    attributes?: any;
    updatedBy: string;
    isActive?: boolean;
  }
) => {
  const topic = await prisma.topic.findUnique({ where: { topicId } });

  if (!topic) throw new Error("Topic not found.");

  const topicJson = topic.topicJson as Record<string, any>;

  const updatedJson = {
    ...topicJson,
    priority: data.priority ?? topicJson.priority,
    attributes: data.attributes ?? topicJson.attributes,
    isActive: data.isActive ?? topicJson.isActive,
    updatedAt: new Date().toISOString(),
    updatedBy: data.updatedBy,
  };

  const updatedTopic = await prisma.topic.update({
    where: { topicId },
    data: {
      priority: data.priority,
      updatedBy: data.updatedBy,
      topicJson: updatedJson,
      isActive: data.isActive,
    },
  });

  // await createAuditLog({
  //   entityType: "Topic",
  //   entityId: topic.topicId,
  //   action: "UPDATE",
  //   performedBy: data.updatedBy,
  //   details: updatedJson,
  // });

  await createChangeLog({
    entityType: "TOPIC",
    entityId: topic.topicId,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.updatedBy,
    createdBy: data.updatedBy,
    notes: "Topic updated by user",
  });

  await createNotification({
    userId: data.updatedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: topic.topicId,
    title: "Topic Updated",
    message: `New topic updated`,
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

  await createChangeLog({
    entityType: "TOPIC",
    entityId: topic.topicId,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: deletedBy,
    createdBy: deletedBy,
    notes: "Topic soft deleted by user",
  });

  await createNotification({
    userId: deletedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: topic.topicId,
    title: "Topic Deactivated",
    message: `New topic deactivated`,
  });

  return deletedTopic;
};

export const getAllTopics = async () => {
  return await prisma.topic.findMany({
    include: {
      section: true,
    },
  });
};

export const getAllActiveTopics = async () => {
  return await prisma.topic.findMany({
    where: {
      isActive: true,
    },
    include: {
      section: true,
    },
  });
};

export const removeTopic = async (id: string, performedBy: string) => {
  const topic = prisma.topic.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "Topic",
    entityId: id,
    action: "DELETED",
    performedBy: performedBy,
    details: "Topic hard deleted by user",
  });

  await createChangeLog({
    entityType: "TOPIC",
    entityId: id,
    changeType: "DELETE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Topic soft deleted by user",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: id,
    title: "Topic Deleted",
    message: `New topic deleted`,
  });

  return topic;
};
