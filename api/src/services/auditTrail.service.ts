// api\src\services\auditTrail.service.ts

import prisma from "../config/db";
import { base62Encode } from "../utils/base62"; // we'll make this utility

// Create an Audit Log entry
export const createAuditLog = async (data: {
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  details?: any;
}) => {
  const auditId = base62Encode();

  return await prisma.auditLog.create({
    data: {
      id: auditId,
      action: data.action,
      performedBy: data.performedBy,
      entityId: data.entityId,
      entityType: data.entityType,
      details: data.details,
    },
  });
};

// Get all Audit Logs
export const getAllAuditLogs = async () => {
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Get a single Audit Log by ID
export const getAuditLogById = async (id: string) => {
  return await prisma.auditLog.findUnique({
    where: { id },
  });
};
