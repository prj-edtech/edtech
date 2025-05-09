import { Prisma } from "@prisma/client";
import prisma from "../config/db";

export const createChangeLog = async (data: {
  entityType: string;
  entityId: string;
  changeType: string;
  changeStatus: string;
  submittedBy: string;
  jsonData: Prisma.InputJsonValue;
  notes?: string;
  createdBy: string;
}) => {
  return await prisma.changeLog.create({
    data: {
      changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
      entityType: data.entityType,
      entityId: data.entityId,
      changeType: data.changeType,
      changeStatus: data.changeStatus,
      submittedBy: data.submittedBy,
      submittedAt: new Date(),
      jsonData: data.jsonData,
      movedToDev: false,
      movedToQA: false,
      movedToProd: false,
      notes: data.notes || null,
      createdBy: data.createdBy,
    },
  });
};

export const fetchAllChangeLog = async () => {
  return await prisma.changeLog.findMany();
};
