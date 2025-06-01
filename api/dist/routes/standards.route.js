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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const standardController = __importStar(require("../controllers/standards.controller"));
const standardRouter = express_1.default.Router();
// Create a new Standard
standardRouter.post("/", standardController.createStandard);
// Get all Standards
standardRouter.get("/", standardController.getAllStandards);
// Get all active Standards
standardRouter.get("/active", standardController.getAllActiveStandards);
// Get a Standard by ID
standardRouter.get("/:id", standardController.getStandardById);
// Get all Standard by board
standardRouter.get("/:boardId/board", standardController.getStandardByBoard);
// Update a Standard
standardRouter.put("/:id", standardController.updateStandard);
// Deactivate a Standard
standardRouter.patch("/:id/deactivate", standardController.deactivateStandard);
// Activate a Standard
standardRouter.patch("/:id/activate", standardController.activateStandard);
// Delete a Standard
standardRouter.delete("/:id", standardController.removeStandard);
exports.default = standardRouter;
