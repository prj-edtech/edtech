"use strict";
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
exports.removeStandard = exports.activateStandard = exports.deactivateStandard = exports.updateStandard = exports.getStandardById = exports.getAllActiveStandards = exports.getAllStandards = exports.createStandard = void 0;
const standardService = __importStar(require("../services/standards.service"));
// Controller to create a new standard
const createStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, sortKey, createdBy } = req.body;
        if (!boardId || !sortKey || !createdBy) {
            res.status(400).json({ message: "Missing required fields." });
        }
        const newStandard = yield standardService.createStandard({
            boardId,
            sortKey,
            createdBy,
        });
        res.status(201).json(newStandard);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createStandard = createStandard;
// Controller to get all standards
const getAllStandards = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const standards = yield standardService.getAllStandards();
        res.status(200).json(standards);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllStandards = getAllStandards;
// Controller to get all active standards
const getAllActiveStandards = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const standards = yield standardService.getAllActiveStandards();
        res.status(200).json(standards);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllActiveStandards = getAllActiveStandards;
// Controller to get standard by ID
const getStandardById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const standard = yield standardService.getStandardById(id);
        if (!standard) {
            res.status(404).json({ message: "Standard not found." });
        }
        res.status(200).json(standard);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getStandardById = getStandardById;
// Controller to update a standard
const updateStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isActive, updatedBy } = req.body;
        if (!updatedBy) {
            res.status(400).json({ message: "updatedBy is required." });
        }
        const updatedStandard = yield standardService.updateStandard(id, {
            isActive,
            updatedBy,
        });
        res.status(200).json(updatedStandard);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateStandard = updateStandard;
// Controller to deactivate a standard
const deactivateStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!performedBy) {
            res.status(400).json({ message: "performedBy is required." });
        }
        const result = yield standardService.deactivateStandard(id, performedBy);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deactivateStandard = deactivateStandard;
// Controller to activate a standard
const activateStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        if (!performedBy) {
            res.status(400).json({ message: "performedBy is required." });
        }
        const result = yield standardService.activateStandard(id, performedBy);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.activateStandard = activateStandard;
// Controller to remove a standard
const removeStandard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { performedBy } = req.body;
        const result = yield standardService.deleteStandard(id, performedBy);
        res.status(200).json({ data: result, message: "Standard deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeStandard = removeStandard;
