"use strict";
// api\src\controllers\boards.controller.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBoardController = exports.deleteBoardController = exports.updateBoardController = exports.createBoardController = exports.getBoardByIdController = exports.getAllBoardsController = void 0;
const boardServices = __importStar(require("../services/boards.service"));
// GET /api/boards
const getAllBoardsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boards = yield boardServices.getAllBoards();
        res.status(200).json({ success: true, total: boards.length, data: boards });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllBoardsController = getAllBoardsController;
// GET /api/boards/:id
const getBoardByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const board = yield boardServices.getBoardById(id);
        if (!board) {
            res.status(404).json({ success: false, message: "Board not found" });
        }
        res.status(200).json({ success: true, data: board });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getBoardByIdController = getBoardByIdController;
// POST /api/boards
const createBoardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sortKey, displayName, createdBy } = req.body;
        const board = yield boardServices.createBoard({
            sortKey,
            displayName,
            createdBy,
        });
        res.status(201).json({ success: true, data: board });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createBoardController = createBoardController;
// PUT /api/boards/:id
const updateBoardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { displayName, isActive, updatedBy } = req.body;
        const board = yield boardServices.updateBoard(id, {
            displayName,
            isActive,
            updatedBy,
        });
        res.status(200).json({ success: true, data: board });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateBoardController = updateBoardController;
// DELETE /api/boards/:id
const deleteBoardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body; // should be auth0Id ideally
        const board = yield boardServices.deleteBoard(id, performedBy);
        res
            .status(200)
            .json({ success: true, message: "Board soft-deleted", data: board });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteBoardController = deleteBoardController;
// DELETE /api/boards/remove/:id
const removeBoardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const board = yield boardServices.removeBoard(id);
        res
            .status(200)
            .json({ success: true, message: "Board removed", data: board });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.removeBoardController = removeBoardController;
