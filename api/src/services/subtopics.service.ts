import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";

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
    isActive: true,
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
      priority,
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

  return subTopic;
};

export const getSubTopicsByTopic = async (topicId: string) => {
  return prisma.subTopic.findMany({
    where: { topicId, isActive: true },
    orderBy: { priority: "asc" },
  });
};

export const updateSubTopic = async ({
  subTopicId,
  displayName,
  priority,
  contentPath,
  updatedBy,
}: {
  subTopicId: string;
  displayName: string;
  priority: number;
  contentPath: string;
  updatedBy: string;
}) => {
  const existing = await prisma.subTopic.findUnique({
    where: { subTopicId },
  });

  if (!existing) throw new Error("SubTopic not found");

  // Update JSON
  const updatedJson = {
    ...(existing.subTopicJson as Record<string, any>),
    subtopicContentPath: contentPath,
    priority,
    attributes: { displayName },
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  const updatedSubTopic = await prisma.subTopic.update({
    where: { subTopicId },
    data: {
      priority,
      updatedBy,
      subTopicJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "SubTopic",
    entityId: existing.id,
    action: "UPDATE",
    performedBy: updatedBy,
    details: updatedJson,
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
};
