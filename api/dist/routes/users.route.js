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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers = __importStar(require("../controllers/users.controller"));
const userRouter = (0, express_1.Router)();
// GET /api/users — get all users
userRouter.get("/", userControllers.getAllUsersController);
// GET /api/users/admin — get all admins
userRouter.get("/admin", userControllers.getAllAdminsController);
// GET /api/users/editor — get all editors
userRouter.get("/editor", userControllers.getAllEditorsController);
// GET /api/users/reviewer — get all reviewers
userRouter.get("/reviewer", userControllers.getAllReviewersController);
// GET /api/users/:id — get user by ID
userRouter.get("/:id", userControllers.getUserByIdController);
// POST /api/users — create a new user (likely via Auth0 webhook)
userRouter.post("/", userControllers.createUserController);
// DELETE /api/users/:id — delete a user
userRouter.delete("/:id", userControllers.deleteUserByIdController);
exports.default = userRouter;
