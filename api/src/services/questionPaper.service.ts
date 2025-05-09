import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";

interface QuestionPaperPayload {
  partitionKey: string;
  sortKey: string;
  year: string;
  month: string;
  totalMarks: number;
  attributes: any;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  boardId: string;
  standardId: string;
  subjectId: string;
}

// Create Question Paper
export const createQuestionPaper = async (data: QuestionPaperPayload) => {
  const questionPaperJson = {
    partitionKey: data.partitionKey,
    sortKey: data.sortKey,
    year: data.year,
    month: data.month,
    totalMarks: data.totalMarks,
    attributes: data.attributes,
    isActive: data.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
    updatedBy: data.updatedBy,
  };

  const questionPaper = await prisma.questionPaper.create({
    data: {
      ...data,
      questionPaperJson,
    },
  });

  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: questionPaper.id,
    action: "CREATE",
    performedBy: data.createdBy,
    details: questionPaperJson,
  });

  return questionPaper;
};

// Update Question Paper
export const updateQuestionPaper = async (
  id: string,
  updates: Partial<QuestionPaperPayload>
) => {
  const existing = await prisma.questionPaper.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("QuestionPaper not found");
  }

  const updatedJson = {
    ...(existing.questionPaperJson as Record<string, any>),
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: updates.updatedBy || existing.updatedBy,
  };

  const updated = await prisma.questionPaper.update({
    where: { id },
    data: {
      ...updates,
      questionPaperJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: id,
    action: "UPDATE",
    performedBy: updates.updatedBy || existing.updatedBy,
    details: updatedJson,
  });

  return updated;
};

// Fetch by Board-Standard-Subject
export const getQuestionPapersByBoardStandardSubject = async (
  boardId: string,
  standardId: string,
  subjectId: string
) => {
  return prisma.questionPaper.findMany({
    where: {
      boardId,
      standardId,
      subjectId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Soft Delete
export const softDeleteQuestionPaper = async (
  id: string,
  performedBy: string
) => {
  const existing = await prisma.questionPaper.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("QuestionPaper not found");
  }

  const updatedJson = {
    ...(existing.questionPaperJson as Record<string, any>),
    isActive: false,
    updatedAt: new Date().toISOString(),
    updatedBy: performedBy,
  };

  const deleted = await prisma.questionPaper.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: performedBy,
      questionPaperJson: updatedJson,
    },
  });

  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: id,
    action: "SOFT_DELETE",
    performedBy,
    details: updatedJson,
  });

  return deleted;
};
