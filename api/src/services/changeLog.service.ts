import { Prisma } from "@prisma/client";
import prisma from "../config/db";

export const createChangeLog = async (data: {
  entityType: string;
  entityId: string;
  changeType: string;
  changeStatus: string;
  submittedBy: string;
<<<<<<< HEAD
  jsonData: Prisma.JsonValue;
=======
  jsonData: Prisma.InputJsonValue;
>>>>>>> fe8e99da1ba29e8ef0c758a3c8d8f674fa11ccf3
  notes?: string;
  createdBy: string;
}) => {
  return await prisma.changeLog.create({
    data: {
<<<<<<< HEAD
      changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`, // Simple unique ID generator
=======
      changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
>>>>>>> fe8e99da1ba29e8ef0c758a3c8d8f674fa11ccf3
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
<<<<<<< HEAD
=======

export const fetchAllChangeLog = async () => {
  return await prisma.changeLog.findMany();
};
>>>>>>> fe8e99da1ba29e8ef0c758a3c8d8f674fa11ccf3
