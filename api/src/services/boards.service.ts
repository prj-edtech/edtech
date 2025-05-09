// api\src\services\boards.service.ts

import prisma from "../config/db";
import { buildBoardJson } from "../utils/jsonBuilder";
import { createAuditLog } from "./auditTrail.service";
import { createChangeLog } from "./changeLog.service";

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

  const changeLogData = {
    changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
    entityType: "BOARD",
    entityId: board.id,
    changeType: "CREATE",
    changeStatus: "AUTO_APPROVED",
    submittedBy: data.createdBy,
    createdBy: data.createdBy,
    submittedAt: new Date(),
    jsonData: {
      // Store all Change Log fields in the jsonData field
      changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
      entityType: "BOARD",
      entityId: board.id,
      changeType: "CREATE",
      changeStatus: "AUTO_APPROVED",
      submittedBy: data.createdBy,
      submittedAt: new Date(),
      jsonData: board.boardJson, // Store the JSON snapshot of the board
      movedToDev: false,
      movedToQA: false,
      movedToProd: false,
      notes: "Admin added board",
    },
    notes: "Admin added board",
  };

  await createChangeLog(changeLogData);

  return board;
};

// Get All Boards
export const getAllBoards = async () => {
  return await prisma.board.findMany({
    orderBy: { createdAt: "desc" },
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
    action: "DELETED",
    performedBy,
    details: {
      previousState: board,
      newState: deletedBoard,
      notes: "Soft delete by setting isActive: false",
    },
  });

  return deletedBoard;
};

export const removeBoard = async (id: string) => {
  return await prisma.board.delete({
    where: {
      id,
    },
  });
};
