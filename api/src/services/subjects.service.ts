// api\src\services\subjects.service.ts

import { JsonObject } from "@prisma/client/runtime/library";
import prisma from "../config/db";
import { generateSubjectJson } from "../utils/jsonBuilder";
import { createAuditLog } from "./auditTrail.service";

// Create Subject
export const createSubject = async (data: {
  sortKey: string;
  boardId: string;
  standardId: string;
  createdBy: string;
}) => {
  // Fetch board and standard details
  const board = await prisma.board.findUnique({ where: { id: data.boardId } });
  if (!board) throw new Error("Board not found");

  const standard = await prisma.standard.findUnique({
    where: { id: data.standardId },
  });
  if (!standard) throw new Error("Standard not found");

  // Construct partitionKey
  const partitionKey = `Subject#${board.sortKey}#${standard.sortKey}`;

  // Duplicate check
  const existing = await prisma.subject.findUnique({
    where: {
      partitionKey_sortKey: {
        partitionKey,
        sortKey: data.sortKey,
      },
    },
  });
  if (existing)
    throw new Error("Subject already exists in this Board + Standard");

  // Build JSON
  const subjectJson = generateSubjectJson(
    partitionKey,
    data.sortKey,
    data.createdBy,
    data.createdBy
  );

  // Create Subject
  const subject = await prisma.subject.create({
    data: {
      partitionKey,
      sortKey: data.sortKey,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      boardId: data.boardId,
      standardId: data.standardId,
      subjectJson,
    },
  });

  // Log Audit
  await createAuditLog({
    entityType: "SUBJECT",
    entityId: subject.id,
    action: "CREATED",
    performedBy: data.createdBy,
    details: { newState: subject },
  });

  return subject;
};

export const getSubjectsByBoardStandard = async (
  boardId: string,
  standardId: string
) => {
  return await prisma.subject.findMany({
    where: {
      boardId,
      standardId,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateSubject = async (
  id: string,
  data: { isActive?: boolean; updatedBy: string }
) => {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) throw new Error("Subject not found");

  // Type guard: cast or fallback
  const existingJson = (existing.subjectJson as JsonObject) ?? {};

  const updatedJson = {
    ...existingJson,
    isActive: data.isActive ?? existing.isActive,
    updatedAt: new Date().toISOString(),
    updatedBy: data.updatedBy,
  };

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: {
      isActive: data.isActive ?? existing.isActive,
      updatedBy: data.updatedBy,
      subjectJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "SUBJECT",
    entityId: id,
    action: "UPDATED",
    performedBy: data.updatedBy,
    details: {
      previousState: existing,
      newState: updatedSubject,
    },
  });

  return updatedSubject;
};

export const softDeleteSubject = async (id: string, performedBy: string) => {
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) throw new Error("Subject not found");

  const existingJson = (existing.subjectJson as JsonObject) ?? {};

  const updatedJson = {
    ...existingJson,
    isActive: false,
    updatedAt: new Date().toISOString(),
    updatedBy: performedBy,
  };

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: performedBy,
      subjectJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "SUBJECT",
    entityId: id,
    action: "DELETED",
    performedBy,
    details: {
      previousState: existing,
      newState: updatedSubject,
      notes: "Soft delete via isActive false",
    },
  });

  return updatedSubject;
};

export const getAllSubjects = async () => {
  return await prisma.subject.findMany();
};
