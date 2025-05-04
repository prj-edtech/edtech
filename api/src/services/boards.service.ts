import prisma from "../config/db";
import { createAuditLog } from "./auditTrail.service";
import { base62Encode } from "../utils/base62";

// Create Board
export const createBoard = async (data: {
  sortKey: string;
  displayName: string;
  createdBy: string;
  boardJson: any;
}) => {
  const board = await prisma.board.create({
    data: {
      sortKey: data.sortKey,
      displayName: data.displayName,
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
      boardJson: data.boardJson,
    },
  });

  // Audit log
  await createAuditLog({
    entityType: "BOARD",
    entityId: board.id,
    action: "CREATED",
    performedBy: data.createdBy,
    details: { newState: board },
  });

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
    boardJson?: any;
  }
) => {
  const previousState = await prisma.board.findUnique({ where: { id } });
  if (!previousState) throw new Error("Board not found");

  const updatedBoard = await prisma.board.update({
    where: { id },
    data: {
      displayName: data.displayName,
      isActive: data.isActive,
      updatedBy: data.updatedBy,
      boardJson: data.boardJson,
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

  const deletedBoard = await prisma.board.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: performedBy,
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
