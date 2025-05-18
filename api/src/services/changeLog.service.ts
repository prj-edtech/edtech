import { Prisma } from "@prisma/client";
import prisma from "../config/db";

export const createChangeLog = async (data: {
  entityType: string;
  entityId: string;
  changeType: string;
  changeStatus: string;
  submittedBy: string;
  notes?: string;
  createdBy: string;
}) => {
  const submittedAt = new Date();

  const changeLogData = {
    changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
    entityType: data.entityType,
    entityId: data.entityId,
    changeType: data.changeType,
    changeStatus: data.changeStatus,
    submittedBy: data.submittedBy,
    submittedAt: submittedAt,
    movedToDev: false,
    movedToQA: false,
    movedToProd: false,
    notes: data.notes || null,
    createdBy: data.createdBy,
  };

  return await prisma.changeLog.create({
    data: {
      ...changeLogData,
      jsonData: changeLogData, // save this object as the jsonData
    },
  });
};

export const fetchAllChangeLog = async () => {
  return await prisma.changeLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      User: true,
    },
  });
};
