import prisma from "../config/db";
import { base62Encode } from "../utils/base62";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";

// Interface for creating a Question Paper
interface QuestionPaperPayload {
  year: string;
  month: string;
  totalMarks: number;
  attributes: any;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  boardCode: string; // Add boardCode, standardCode, and subjectName to form keys
  standardCode: string;
  subjectName: string;
  boardId: string; // Required for relational integrity
  standardId: string; // Required for relational integrity
  subjectId: string; // Required for relational integrity
}

// Create Question Paper
export const createQuestionPaper = async (data: QuestionPaperPayload) => {
  // Generate a unique ID for the Question Paper (could be similar to how you generate subtopicId)
  const questionPaperId = base62Encode(); // Or any other method for generating a unique identifier

  // Build partition and sort keys like in the SubTopic service
  const partitionKey = `QuestionPaper#${data.boardCode}#${data.standardCode}`;
  const sortKey = `${data.subjectName}#${data.year}#${data.month}#${questionPaperId}`;

  // Assemble the strict production JSON (mirroring the same structure for consistency)
  const questionPaperJson = {
    partitionKey,
    sortKey,
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

  // Create the Question Paper in the database, include the relational data (board, standard, subject)
  const questionPaper = await prisma.questionPaper.create({
    data: {
      partitionKey,
      sortKey,
      year: data.year,
      month: data.month,
      totalMarks: data.totalMarks,
      attributes: data.attributes,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      questionPaperJson, // Store the full JSON structure for audit and reference

      // Include the required relations (board, standard, and subject)
      board: {
        connect: { id: data.boardId }, // Assuming boardId is the primary key in Board model
      },
      standard: {
        connect: { id: data.standardId }, // Assuming standardId is the primary key in Standard model
      },
      subject: {
        connect: { id: data.subjectId }, // Assuming subjectId is the primary key in Subject model
      },
    },
  });

  // Create an audit log for the creation of the question paper
  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: questionPaper.id,
    action: "CREATE",
    performedBy: data.createdBy,
    details: questionPaperJson,
  });

  await createChangeLog({
    entityType: "QUESTION_PAPER",
    entityId: questionPaper.id,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    notes: "Question paper created",
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

  await createChangeLog({
    entityType: "QUESTION_PAPER",
    entityId: id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: updates.updatedBy || existing.updatedBy,
    createdBy: updates.updatedBy || existing.updatedBy,
    notes: "Question paper updated",
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

  await createChangeLog({
    entityType: "QUESTION_PAPER",
    entityId: id,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question paper deactivated",
  });

  return deleted;
};

export const removeQuestionPaper = async (id: string, performedBy: string) => {
  const questionPaper = await prisma.questionPaper.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: id,
    action: "DELETE",
    performedBy: performedBy,
    details: "Question paper hard deleted",
  });

  await createChangeLog({
    entityType: "QUESTION_PAPER",
    entityId: id,
    changeType: "DELETE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question paper hard deleted",
  });

  return questionPaper;
};

export const activateQuestionPaper = async (
  id: string,
  performedBy: string
) => {
  const questionPaper = await prisma.questionPaper.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });

  await createAuditLog({
    entityType: "QuestionPaper",
    entityId: id,
    action: "ACTIVATE",
    performedBy: performedBy,
    details: "Question paper activated",
  });

  await createChangeLog({
    entityType: "QUESTION_PAPER",
    entityId: id,
    changeType: "ACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question paper activated",
  });

  return questionPaper;
};

export const getAllQuestionPaper = async () => {
  return await prisma.questionPaper.findMany({
    include: {
      board: true,
      standard: true,
      subject: true,
    },
  });
};
