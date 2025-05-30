import { ReviewStatus } from "@prisma/client";
import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";
import { createNotification } from "./notifications.service";

export const createSubTopic = async ({
  boardCode,
  standardCode,
  subjectName,
  sectionId,
  topicId,
  displayName,
  priority,
  contentPath,
  createdBy,
}: {
  boardCode: string;
  standardCode: string;
  subjectName: string;
  sectionId: string;
  topicId: string;
  displayName: string;
  priority: number;
  contentPath: string;
  createdBy: string;
}) => {
  // Generate Base62 subtopic ID
  const subTopicId = base62Encode();

  // Build partition and sort keys
  const partitionKey = `SubTopic#${boardCode}#${standardCode}`;
  const sortKey = `${subjectName}#${sectionId}#${topicId}#${subTopicId}`;
  const priorityNumber = Number(priority);

  // Assemble strict production JSON
  const subTopicJson = {
    partitionKey,
    sortKey,
    topicId,
    sectionId,
    subTopicId,
    subtopicContentPath: contentPath,
    priority,
    attributes: { displayName },
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    updatedBy: createdBy,
  };

  // Persist to DB
  const subTopic = await prisma.subTopic.create({
    data: {
      partitionKey,
      sortKey,
      subTopicId,
      topicId,
      sectionId,
      priority: priorityNumber,
      subtopicContentPath: contentPath, // added missing field
      createdBy,
      updatedBy: createdBy,
      subTopicJson,
    },
  });

  // Audit trail
  await createAuditLog({
    entityType: "SubTopic",
    entityId: subTopic.id,
    action: "CREATE",
    performedBy: createdBy,
    details: subTopicJson,
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: subTopic.id,
    changeType: "CREATE",
    changeStatus: "REQUESTED",
    submittedBy: createdBy,
    createdBy: createdBy,
    notes: "Subtopic created and waiting to be reviewed",
  });

  await createNotification({
    userId: createdBy,
    eventType: "TOPIC",
    entityType: "SUBMISSION_FOR_REVIEW ",
    entityId: subTopic.id,
    title: "Subtopic Created",
    message: `New subtopic created`,
  });

  return subTopic;
};

export const getSubTopicsByTopic = async (topicId: string) => {
  return prisma.subTopic.findMany({
    where: { topicId, isActive: true },
    orderBy: { priority: "asc" },
  });
};

export const updateSubTopic = async ({
  id,
  displayName,
  priority,
  contentPath,
  updatedBy,
}: {
  id: string;
  displayName: string;
  priority: number;
  contentPath: string;
  updatedBy: string;
}) => {
  console.log("[Service] updateSubTopic called with:", {
    id,
    displayName,
    priority,
    contentPath,
    updatedBy,
  });

  const existing = await prisma.subTopic.findUnique({
    where: { id },
  });

  if (!existing) {
    console.error(`[Service] SubTopic with id=${id} not found`);
    throw new Error("SubTopic not found");
  }
  console.log("[Service] Existing subtopic found:", existing);

  const updatedJson = {
    ...(existing.subTopicJson as Record<string, any>),
    subtopicContentPath: contentPath,
    priority,
    attributes: { displayName },
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  console.log("[Service] Updated JSON to save:", updatedJson);

  const updatedSubTopic = await prisma.subTopic.update({
    where: { id },
    data: {
      priority,
      updatedBy,
      subTopicJson: updatedJson,
      review: ReviewStatus.PENDING,
    },
  });

  console.log("[Service] Updated SubTopic record:", updatedSubTopic);

  await createAuditLog({
    entityType: "SubTopic",
    entityId: existing.id,
    action: "UPDATE",
    performedBy: updatedBy,
    details: updatedJson,
  });
  console.log("[Service] Audit log created");

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: existing.id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: updatedBy,
    createdBy: updatedBy,
    notes: "Subtopic updated",
  });
  console.log("[Service] Change log created");

  await createNotification({
    userId: updatedBy,
    eventType: "TOPIC",
    entityType: "SUBMISSION_FOR_REVIEW ",
    entityId: existing.id,
    title: "Review updated subtopic",
    message: `New subtopic updated`,
  });

  return updatedSubTopic;
};

export const softDeleteSubTopic = async (
  subTopicId: string,
  performedBy: string
) => {
  const existing = await prisma.subTopic.findUnique({
    where: { subTopicId },
  });

  if (!existing) throw new Error("SubTopic not found");

  // Update isActive & JSON
  const updatedJson = {
    ...(existing.subTopicJson as Record<string, any>),
    isActive: false,
    updatedAt: new Date().toISOString(),
    updatedBy: performedBy,
  };

  await prisma.subTopic.update({
    where: { subTopicId },
    data: {
      isActive: false,
      updatedBy: performedBy,
      subTopicJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: existing.id,
    action: "SOFT_DELETE",
    performedBy,
    details: updatedJson,
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: existing.id,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Subtopic deactivated",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: existing.id,
    title: "Subtopic Deactivated",
    message: `New subtopic deactivated`,
  });
};

export const getAllSubtopics = async () => {
  return await prisma.subTopic.findMany({
    include: {
      topic: true,
      section: true,
    },
  });
};

export const getAllApprovedSubtopics = async () => {
  return await prisma.subTopic.findMany({
    where: {
      review: ReviewStatus.APPROVED,
    },
  });
};

export const getAllRejectedSubtopics = async () => {
  return await prisma.subTopic.findMany({
    where: {
      review: ReviewStatus.REJECTED,
    },
  });
};

export const getAllPendingSubtopics = async () => {
  return await prisma.subTopic.findMany({
    where: {
      review: ReviewStatus.PENDING,
    },
  });
};

export const removeSubtopic = async (id: string, performedBy: string) => {
  const deletedSubtopic = await prisma.subTopic.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "SOFT_DELETE",
    performedBy: performedBy,
    details: "Deactivated by admin",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "DELETE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Subtopic hard deleted by admin",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: id,
    title: "Subtopic Deleted",
    message: `New subtopic deleted`,
  });

  return deletedSubtopic;
};

export const activeSubtopic = async (id: string, performedBy: string) => {
  const subtopic = await prisma.subTopic.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "SOFT_DELETE",
    performedBy: performedBy,
    details: "Deactivated by admin",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "DELETE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Subtopic hard deleted by admin",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: id,
    title: "Subtopic activated",
    message: `New subtopic Activated`,
  });

  return subtopic;
};

export const deactiveSubtopic = async (id: string, performedBy: string) => {
  const subtopic = await prisma.subTopic.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "SOFT_DELETE",
    performedBy: performedBy,
    details: "Deactivated by admin",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "DELETE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Subtopic hard deleted by admin",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: id,
    title: "Subtopic deactivated",
    message: `New subtopic Deactivated`,
  });

  return subtopic;
};

export const getSingleSubtopic = async (id: string) => {
  return await prisma.subTopic.findUnique({
    where: {
      id,
    },
  });
};

export const approveSubtopic = async (id: string, performedBy: string) => {
  const subtopic = await prisma.subTopic.update({
    where: {
      id,
    },
    data: {
      isActive: true,
      review: "APPROVED",
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "APPROVED",
    performedBy: performedBy,
    details: "Request was approved",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "APPROVED",
    changeStatus: "APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Request was approved",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "REVIEW_FEEDBACK",
    entityId: id,
    title: "Subtopic Approved",
    message: `New subtopic approved`,
  });

  return subtopic;
};

export const rejectSubtopic = async (id: string, performedBy: string) => {
  const subtopic = await prisma.subTopic.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      review: "REJECTED",
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "REJECTED",
    performedBy: performedBy,
    details: "Request was disapproved",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "REJECTED",
    changeStatus: "REJECTED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Request was disapproved",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "REVIEW_FEEDBACK",
    entityId: id,
    title: "Subtopic Rejected",
    message: `New subtopic rejected`,
  });

  return subtopic;
};

export const resetSubtopic = async (id: string, performedBy: string) => {
  const subtopic = await prisma.subTopic.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      review: "PENDING",
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: id,
    action: "REQUESTED",
    performedBy: performedBy,
    details: "Waiting for Approval",
  });

  await createChangeLog({
    entityType: "SUBTOPIC",
    entityId: id,
    changeType: "PENDING",
    changeStatus: "REQUESTED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Waiting for Approval",
  });

  await createNotification({
    userId: performedBy,
    eventType: "TOPIC",
    entityType: "REVIEW_FEEDBACK",
    entityId: id,
    title: "Subtopic Pending to review",
    message: `New subtopic pending to review`,
  });

  return subtopic;
};
