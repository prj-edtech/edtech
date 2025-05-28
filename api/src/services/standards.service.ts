import { JsonValue } from "@prisma/client/runtime/library";
import prisma from "../config/db";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";

// Utility to validate Roman numerals (I to XII)
const isRomanNumeral = (value: string) =>
  /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/.test(value);

// Type guard for JsonObject
function isJsonObject(value: JsonValue): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Create a new Standard
export const createStandard = async (data: {
  boardId: string;
  sortKey: string;
  createdBy: string;
}) => {
  const board = await prisma.board.findUnique({
    where: { id: data.boardId },
  });

  if (!board) {
    throw new Error("Board not found.");
  }

  // Validate Roman numeral format
  if (!isRomanNumeral(data.sortKey)) {
    throw new Error("sortKey must be a valid Roman numeral between I and XII.");
  }

  const partitionKey = `Standard#${board.sortKey}`;

  // Check for duplicate (partitionKey + sortKey)
  const existing = await prisma.standard.findFirst({
    where: { partitionKey, sortKey: data.sortKey },
  });

  if (existing) {
    throw new Error(
      "A standard with this sortKey already exists under the selected board."
    );
  }

  const timestamp = new Date().toISOString();

  const standardJson = [
    {
      partitionKey,
      sortKey: data.sortKey,
      attributes: {
        displayName: data.sortKey,
      },
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    },
  ];

  const newStandard = await prisma.standard.create({
    data: {
      partitionKey,
      sortKey: data.sortKey,
      isActive: true,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      boardId: data.boardId,
      standardJson,
    },
  });

  // Log to audit trail
  await createAuditLog({
    entityType: "STANDARD",
    entityId: newStandard.id,
    action: "CREATE",
    performedBy: data.createdBy,
    details: standardJson,
  });

  await createChangeLog({
    entityType: "STANDARDS",
    entityId: newStandard.id,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    notes: "Standard created without needing to be reviewed",
  });

  return newStandard;
};

export const getAllStandards = async () => {
  return await prisma.standard.findMany({
    include: {
      board: true, // include associated board details
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllActiveStandards = async () => {
  return await prisma.standard.findMany({
    where: {
      isActive: true,
    },
    include: {
      board: true, // include associated board details
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getStandardById = async (id: string) => {
  return await prisma.standard.findUnique({
    where: { id },
    include: {
      board: true,
    },
  });
};

export const updateStandard = async (
  id: string,
  data: {
    isActive?: boolean;
    updatedBy: string;
  }
) => {
  const standard = await prisma.standard.findUnique({
    where: { id },
  });

  if (!standard) {
    throw new Error("Standard not found.");
  }

  const updatedAt = new Date().toISOString();

  // Validate standardJson is an object
  if (!isJsonObject(standard.standardJson)) {
    throw new Error("Invalid standardJson format.");
  }

  const updatedJson = {
    ...standard.standardJson,
    isActive: data.isActive ?? standard.isActive,
    updatedAt,
    updatedBy: data.updatedBy,
  };

  const updatedStandard = await prisma.standard.update({
    where: { id },
    data: {
      isActive: data.isActive ?? standard.isActive,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
      standardJson: updatedJson,
    },
  });

  // Audit log entry for UPDATE action
  await createAuditLog({
    entityType: "STANDARD",
    entityId: updatedStandard.id,
    action: "UPDATE",
    performedBy: data.updatedBy,
    details: updatedJson, // we log the full updated JSON payload for traceability
  });

  await createChangeLog({
    entityType: "STANDARDS",
    entityId: updatedStandard.id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.updatedBy,
    createdBy: data.updatedBy,
    notes: "Standard updated without needing to be reviewed",
  });

  return updatedStandard;
};

export const deactivateStandard = async (id: string, performedBy: string) => {
  const standard = await prisma.standard.update({
    where: {
      id,
    },
    data: {
      updatedBy: performedBy,
      isActive: false,
    },
  });

  // Log as DEACTIVATE instead of UPDATE
  await createAuditLog({
    entityType: "STANDARD",
    entityId: standard.id,
    action: "DEACTIVATE",
    performedBy,
    details: standard.standardJson,
  });

  await createChangeLog({
    entityType: "STANDARDS",
    entityId: standard.id,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Standard soft deleted without needing to be reviewed",
  });

  return standard;
};

export const activateStandard = async (id: string, performedBy: string) => {
  const standard = await prisma.standard.update({
    where: {
      id,
    },
    data: {
      updatedBy: performedBy,
      isActive: true,
    },
  });

  // Log as ACTIVATE instead of UPDATE
  await createAuditLog({
    entityType: "STANDARD",
    entityId: standard.id,
    action: "ACTIVATE",
    performedBy,
    details: standard.standardJson,
  });

  await createChangeLog({
    entityType: "STANDARDS",
    entityId: standard.id,
    changeType: "ACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Standard activated without needing to be reviewed",
  });

  return standard;
};

export const deleteStandard = async (id: string, performedBy: string) => {
  const deletedStandard = await prisma.standard.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "STANDARD",
    entityId: id,
    action: "DELETE",
    performedBy: performedBy,
    details: "N/A",
  });

  await createChangeLog({
    entityType: "STANDARDS",
    entityId: id,
    changeType: "ACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Standard hard deleted without needing to be reviewed",
  });

  return deletedStandard;
};

export const getStandardByBoard = async (boardId: string) => {
  const standard = await prisma.standard.findMany({
    where: {
      boardId,
      isActive: true,
    },
  });

  return standard;
};
