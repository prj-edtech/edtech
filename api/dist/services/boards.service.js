"use strict";
// api\src\services\boards.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBoard = exports.deleteBoard = exports.updateBoard = exports.getBoardById = exports.getAllBoards = exports.createBoard = void 0;
const db_1 = __importDefault(require("../config/db"));
const jsonBuilder_1 = require("../utils/jsonBuilder");
const auditTrail_service_1 = require("./auditTrail.service");
// Create Board
const createBoard = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = new Date().toISOString();
    const boardJson = (0, jsonBuilder_1.buildBoardJson)({
        sortKey: data.sortKey,
        displayName: data.displayName,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
    });
    const board = yield db_1.default.board.create({
        data: {
            sortKey: data.sortKey,
            displayName: data.displayName,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            boardJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "BOARD",
        entityId: board.id,
        action: "CREATED",
        performedBy: data.createdBy,
        details: { newState: board },
    });
    return board;
});
exports.createBoard = createBoard;
// Get All Boards
const getAllBoards = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.board.findMany({
        orderBy: { createdAt: "desc" },
    });
});
exports.getAllBoards = getAllBoards;
// Get Single Board
const getBoardById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.board.findUnique({
        where: { id },
    });
});
exports.getBoardById = getBoardById;
// Update Board
const updateBoard = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const previousState = yield db_1.default.board.findUnique({ where: { id } });
    if (!previousState)
        throw new Error("Board not found");
    const updatedAt = new Date().toISOString();
    const newBoardJson = (0, jsonBuilder_1.buildBoardJson)({
        sortKey: previousState.sortKey,
        displayName: data.displayName || previousState.displayName,
        isActive: data.isActive !== undefined ? data.isActive : previousState.isActive,
        createdAt: previousState.createdAt.toISOString(),
        updatedAt,
        createdBy: previousState.createdBy,
        updatedBy: data.updatedBy,
    });
    const updatedBoard = yield db_1.default.board.update({
        where: { id },
        data: {
            displayName: data.displayName || previousState.displayName,
            isActive: data.isActive !== undefined ? data.isActive : previousState.isActive,
            updatedBy: data.updatedBy,
            updatedAt: new Date(),
            boardJson: newBoardJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
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
});
exports.updateBoard = updateBoard;
// Delete Board (Soft Delete via isActive)
const deleteBoard = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield db_1.default.board.findUnique({ where: { id } });
    if (!board)
        throw new Error("Board not found");
    const updatedAt = new Date().toISOString();
    const newBoardJson = (0, jsonBuilder_1.buildBoardJson)({
        sortKey: board.sortKey,
        displayName: board.displayName,
        isActive: false,
        createdAt: board.createdAt.toISOString(),
        updatedAt,
        createdBy: board.createdBy,
        updatedBy: performedBy,
    });
    const deletedBoard = yield db_1.default.board.update({
        where: { id },
        data: {
            isActive: false,
            updatedBy: performedBy,
            updatedAt: new Date(),
            boardJson: newBoardJson,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
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
});
exports.deleteBoard = deleteBoard;
const removeBoard = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.board.delete({
        where: {
            id,
        },
    });
});
exports.removeBoard = removeBoard;
