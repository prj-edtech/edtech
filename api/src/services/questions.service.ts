import prisma from "../config/db";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";

/**
 * Create a new Question
 */
export const createQuestion = async (data: any, performedBy: string) => {
  const {
    partitionKey,
    sortKey,
    year,
    month,
    questionId,
    questionPaperId,
    sectionId,
    topicId,
    subTopicId,
    marks,
    priority,
    questionType,
    questionContentPath,
    questionAnswerPath,
    attributes,
  } = data;

  const jsonData = {
    partitionKey,
    sortKey,
    year,
    month,
    questionId,
    questionPaperId,
    sectionId,
    topicId,
    subTopicId,
    marks,
    priority,
    questionType,
    questionContentPath,
    questionAnswerPath,
    attributes,
  };

  const question = await prisma.question.create({
    data: {
      partitionKey,
      sortKey,
      year,
      month,
      questionId,
      questionPaperId,
      sectionId,
      topicId,
      subTopicId,
      marks,
      priority,
      questionType,
      questionContentPath,
      questionAnswerPath,
      attributes,
      createdBy: performedBy,
      updatedBy: performedBy,
      questionJson: jsonData,
    },
  });

  await createAuditLog({
    entityType: "QUESTION",
    entityId: questionId,
    action: "CREATED",
    performedBy,
    details: { newState: question },
  });

  await createChangeLog({
    entityType: "QUESTION",
    entityId: questionId,
    changeType: "CREATE",
    changeStatus: "REQUESTED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question created",
  });

  return question;
};

/**
 * Update an existing Question
 */
export const updateQuestion = async (
  id: string,
  data: any,
  performedBy: string
) => {
  const previous = await prisma.question.findUnique({ where: { id } });
  if (!previous) throw new Error("Question not found");

  const question = await prisma.question.update({
    where: { id },
    data: {
      ...data,
      updatedBy: performedBy,
    },
  });

  await createAuditLog({
    entityType: "QUESTION",
    entityId: previous.questionId,
    action: "UPDATED",
    performedBy,
    details: {
      previousState: previous,
      newState: question,
    },
  });

  await createChangeLog({
    entityType: "QUESTION",
    entityId: previous.questionId,
    changeType: "UPDATE",
    changeStatus: "REQUESTED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question updated",
  });

  return question;
};

/**
 * Hard delete a Question
 */
export const deleteQuestion = async (id: string, performedBy: string) => {
  const previous = await prisma.question.findUnique({ where: { id } });
  if (!previous) throw new Error("Question not found");

  const question = await prisma.question.delete({ where: { id } });

  await createAuditLog({
    entityType: "QUESTION",
    entityId: previous.questionId,
    action: "DELETE",
    performedBy,
    details: {
      previousState: previous,
      notes: "Hard delete performed",
    },
  });

  await createChangeLog({
    entityType: "QUESTION",
    entityId: previous.questionId,
    changeType: "REMOVE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Question hard deleted",
  });

  return question;
};

/**
 * Get all Questions (optionally filter by isActive)
 */
export const getAllQuestions = async (isActive?: boolean) => {
  const questions = await prisma.question.findMany({
    where: isActive !== undefined ? { isActive } : {},
    orderBy: { createdAt: "desc" },
  });
  return questions;
};

/**
 * Get Question by its database ID
 */
export const getQuestionById = async (id: string) => {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw new Error("Question not found");
  return question;
};

/**
 * Get all Questions by QuestionPaper ID (foreign key)
 */
export const getQuestionsByQuestionPaperId = async (
  questionPaperId: string
) => {
  const questions = await prisma.question.findMany({
    where: { questionPaperId },
    orderBy: { priority: "asc" },
  });
  return questions;
};
