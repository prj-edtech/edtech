// api\src\services\boards.service.ts

import prisma from "../config/db";
import { buildBoardJson } from "../utils/jsonBuilder";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";
import { createNotification } from "./notifications.service";

// Create Board
export const createBoard = async (data: {
  sortKey: string;
  displayName: string;
  createdBy: string;
}) => {
  const timestamp = new Date().toISOString();

  const boardJson = buildBoardJson({
    sortKey: data.sortKey,
    displayName: data.displayName,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: data.createdBy,
    updatedBy: data.createdBy,
  });

  const board = await prisma.board.create({
    data: {
      sortKey: data.sortKey,
      displayName: data.displayName,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      boardJson,
    },
  });

  await createAuditLog({
    entityType: "BOARD",
    entityId: board.id,
    action: "CREATED",
    performedBy: data.createdBy,
    details: { newState: board },
  });

  await createChangeLog({
    entityType: "BOARD",
    entityId: board.id,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    notes: "Board created by admin",
  });

  await createNotification({
    userId: data.createdBy,
    eventType: "BOARD",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: board.id,
    title: "Board Created",
    message: `New board created`,
  });

  return board;
};

// Get All Boards
export const getAllBoards = async () => {
  return await prisma.board.findMany({
    orderBy: { createdAt: "asc" },
  });
};

// Get All active Boards
export const getAllActiveBoards = async () => {
  return await prisma.board.findMany({
    where: {
      isActive: true,
    },
  });
};

// Get Single Board
export const getBoardById = async (id: string) => {
  return await prisma.board.findUnique({
    where: { id },
  });
};

// Update Board
export const updateBoard = async (
  id: string,
  data: {
    displayName?: string;
    isActive?: boolean;
    updatedBy: string;
  }
) => {
  const previousState = await prisma.board.findUnique({ where: { id } });
  if (!previousState) throw new Error("Board not found");

  const updatedAt = new Date().toISOString();

  const newBoardJson = buildBoardJson({
    sortKey: previousState.sortKey,
    displayName: data.displayName || previousState.displayName,
    isActive:
      data.isActive !== undefined ? data.isActive : previousState.isActive,
    createdAt: previousState.createdAt.toISOString(),
    updatedAt,
    createdBy: previousState.createdBy,
    updatedBy: data.updatedBy,
  });

  const updatedBoard = await prisma.board.update({
    where: { id },
    data: {
      displayName: data.displayName || previousState.displayName,
      isActive:
        data.isActive !== undefined ? data.isActive : previousState.isActive,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
      boardJson: newBoardJson,
    },
  });

  await createAuditLog({
    entityType: "BOARD",
    entityId: id,
    action: "UPDATED",
    performedBy: data.updatedBy,
    details: {
      previousState,
      newState: updatedBoard,
    },
  });

  await createChangeLog({
    entityType: "BOARD",
    entityId: id,
    changeType: "UPDATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.updatedBy,
    createdBy: data.updatedBy,
    notes: "Board updated by admin",
  });

  await createNotification({
    userId: data.updatedBy,
    eventType: "BOARD",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: id,
    title: "Board Updated",
    message: `New board updated`,
  });

  return updatedBoard;
};

// Delete Board (Soft Delete via isActive)
export const deleteBoard = async (id: string, performedBy: string) => {
  const board = await prisma.board.findUnique({ where: { id } });
  if (!board) throw new Error("Board not found");

  const updatedAt = new Date().toISOString();

  const newBoardJson = buildBoardJson({
    sortKey: board.sortKey,
    displayName: board.displayName,
    isActive: false,
    createdAt: board.createdAt.toISOString(),
    updatedAt,
    createdBy: board.createdBy,
    updatedBy: performedBy,
  });

  const deletedBoard = await prisma.board.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: performedBy,
      updatedAt: new Date(),
      boardJson: newBoardJson,
    },
  });

  await createAuditLog({
    entityType: "BOARD",
    entityId: id,
    action: "DELETE",
    performedBy,
    details: {
      previousState: board,
      newState: deletedBoard,
      notes: "Soft delete by setting isActive: false",
    },
  });

  await createChangeLog({
    entityType: "BOARD",
    entityId: id,
    changeType: "DEACTIVATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Board soft deleted by admin",
  });

  await createNotification({
    userId: performedBy,
    eventType: "BOARD",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: board.id,
    title: "Board Deactivated",
    message: `New board deactivated`,
  });

  return deletedBoard;
};

export const removeBoard = async (id: string, performedBy: string) => {
  const board = await prisma.board.delete({
    where: {
      id,
    },
  });

  await createAuditLog({
    entityType: "BOARD",
    entityId: id,
    action: "DELETE",
    performedBy: performedBy,
    details: {
      previousState: board,
      newState: board,
      notes: "Hard delete",
    },
  });

  await createChangeLog({
    entityType: "BOARD",
    entityId: id,
    changeType: "REMOVE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: performedBy,
    createdBy: performedBy,
    notes: "Board hard deleted by admin",
  });

  await createNotification({
    userId: performedBy,
    eventType: "BOARD",
    entityType: "SYSTEM_ANNOUNCEMENT",
    entityId: board.id,
    title: "Board Deleted",
    message: `New board deleted`,
  });
};
