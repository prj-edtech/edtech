// api\src\services\sections.service.ts

import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";
import { createNotification } from "./notifications.service";

type SectionJson = {
  partitionKey: string;
  sortKey: string;
  sectionId: string;
  priority: number;
  attributes: {
    displayName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

// Helper to generate Section JSON
const generateSectionJson = (
  partitionKey: string,
  sortKey: string,
  sectionId: string,
  priority: number,
  displayName: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  updatedBy: string
) => {
  return {
    partitionKey,
    sortKey,
    sectionId,
    priority,
    attributes: {
      displayName,
    },
    isActive,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  };
};

// Create Section
export const createSection = async (data: {
  sortKey: string;
  boardId: string;
  standardId: string;
  subjectId: string;
  priority: number;
  displayName: string;
  createdBy: string;
}) => {
  const board = await prisma.board.findUnique({ where: { id: data.boardId } });
  if (!board) throw new Error("Board not found");

  const standard = await prisma.standard.findUnique({
    where: { id: data.standardId },
  });
  if (!standard) throw new Error("Standard not found");

  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });
  if (!subject) throw new Error("Subject not found");

  const partitionKey = `Section#${board.sortKey}#${standard.sortKey}`;

  const existing = await prisma.section.findFirst({
    where: {
      partitionKey,
      subjectId: data.subjectId,
      sectionJson: {
        path: ["attributes", "displayName"],
        equals: data.displayName,
      },
    },
  });
  if (existing)
    throw new Error(
      "Section with this display name already exists in this subject"
    );

  const sectionId = base62Encode();
  const sortKey = `${subject.sortKey}#${sectionId}`;
  const now = new Date().toISOString();

  const sectionJson = generateSectionJson(
    partitionKey,
    sortKey,
    sectionId,
    data.priority,
    data.displayName,
    true, // isActive: true by default
    now,
    now,
    data.createdBy,
    data.createdBy
  );

  const section = await prisma.section.create({
    data: {
      partitionKey,
      sortKey,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      boardId: data.boardId,
      standardId: data.standardId,
      subjectId: data.subjectId,
      sectionJson,
    },
  });

  await createAuditLog({
    entityType: "SECTION",
    entityId: section.id,
    action: "CREATED",
    performedBy: data.createdBy,
    details: { newState: section },
  });

  await createChangeLog({
    entityType: "SECTION",
    entityId: section.id,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    notes: "Section created without needing to be reviewed",
  });

  await createNotification({
    userId: data.createdBy,
    eventType: "SECTION",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: section.id,
    title: "Section Created",
    message: `New section created`,
  });

  return section;
};

// Update Section
export const updateSection = async (data: {
  sectionId: string;
  displayName?: string;
  priority?: number;
  isActive?: boolean;
  updatedBy: string;
}) => {
  // Fetch existing section
  const section = await prisma.section.findUnique({
    where: { id: data.sectionId },
  });
  if (!section) throw new Error("Section not found");

  if (!section.sectionJson) {
    throw new Error("Section JSON data is missing");
  }

  // Typecast sectionJson safely
  const jsonData = section.sectionJson as SectionJson;

  // Update sectionJson fields
  const updatedJson: SectionJson = {
    ...jsonData,
    attributes: {
      displayName: data.displayName || jsonData.attributes.displayName,
    },
    priority: data.priority !== undefined ? data.priority : jsonData.priority,
    isActive: data.isActive !== undefined ? data.isActive : jsonData.isActive,
    updatedAt: new Date().toISOString(),
    updatedBy: data.updatedBy,
  };

  // Update Section
  const updatedSection = await prisma.section.update({
    where: { id: data.sectionId },
    data: {
      sectionJson: updatedJson,
      isActive: data.isActive,
      updatedBy: data.updatedBy,
    },
  });

  // Log Audit
  await createAuditLog({
    entityType: "SECTION",
    entityId: updatedSection.id,
    action: "UPDATED",
    performedBy: data.updatedBy,
    details: { newState: updatedSection },
  });

  await createChangeLog({
    entityType: "SECTION",
    entityId: section.id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.updatedBy,
    createdBy: data.updatedBy,
    notes: "Section updated without needing to be reviewed",
  });

  await createNotification({
    userId: data.updatedBy,
    eventType: "SECTION",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: section.id,
    title: "Section Updated",
    message: `New section updated`,
  });

  return updatedSection;
};

export const getSectionsBySubject = async (subjectId: string) => {
  // Fetch subject and validate
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });
  if (!subject) throw new Error("Subject not found");

  // Fetch active sections, ordered by priority scalar column
  const sections = await prisma.section.findMany({
    where: {
      subjectId,
      isActive: true,
    },
    orderBy: {
      priority: "asc", // use the scalar column here
    },
  });

  return sections;
};

export const softDeleteSection = async (
  sectionId: string,
  performedBy: string
) => {
  // Fetch section
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });
  if (!section) throw new Error("Section not found");

  // Type guard or assertion
  const sectionJson = section.sectionJson as SectionJson;
  if (!sectionJson) throw new Error("Invalid section JSON");

  // Update isActive in sectionJson
  const updatedJson: SectionJson = {
    ...sectionJson,
    isActive: false,
    updatedAt: new Date().toISOString(),
    updatedBy: performedBy,
  };

  // Soft delete section
  const updatedSection = await prisma.section.update({
    where: { id: sectionId },
    data: {
      isActive: false,
      sectionJson: updatedJson,
      updatedBy: performedBy,
    },
  });

  // Log Audit
  await createAuditLog({
    entityType: "SECTION",
    entityId: sectionId,
    action: "SOFT_DELETED",
    performedBy,
    details: { previousState: section, newState: updatedSection },
  });

  await createChangeLog({
    entityType: "SECTION",
    entityId: section.id,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Section soft deleted without needing to be reviewed",
  });

  await createNotification({
    userId: performedBy,
    eventType: "SECTION",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: section.id,
    title: "Section Deactivated",
    message: `New section deactivated`,
  });

  return updatedSection;
};

export const removeSection = async (id: string, performedBy: string) => {
  const section = await prisma.section.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "SECTION",
    entityId: id,
    action: "DELETED",
    performedBy,
  });

  await createChangeLog({
    entityType: "SECTION",
    entityId: section.id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Section hard deleted without needing to be reviewed",
  });

  await createNotification({
    userId: performedBy,
    eventType: "SECTION",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: section.id,
    title: "Section Deleted",
    message: `New section deleted`,
  });

  return section;
};

export const getAllSections = async () => {
  return await prisma.section.findMany({
    include: {
      board: true,
      standard: true,
      subject: true,
    },
  });
};

export const getAllActiveSections = async () => {
  return await prisma.section.findMany({
    include: {
      board: true,
      standard: true,
      subject: true,
    },
  });
};
