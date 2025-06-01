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
exports.deleteUserByIdController = exports.createUserController = exports.getAllReviewersController = exports.getAllEditorsController = exports.getAllAdminsController = exports.getUserByIdController = exports.getAllUsersController = void 0;
const userServices = __importStar(require("../services/users.service"));
// Get all users
const getAllUsersController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userServices.getAllUsers();
        res.status(200).json({ success: true, total: users.length, data: users });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllUsersController = getAllUsersController;
// Get user by id
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userServices.getUserById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getUserByIdController = getUserByIdController;
// Get all admins
const getAllAdminsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userServices.getAllAdmins();
        res.status(200).json({ success: true, total: users.length, data: users });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllAdminsController = getAllAdminsController;
// Get all editors
const getAllEditorsController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userServices.getAllEditor();
        res.status(200).json({ success: true, total: users.length, data: users });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllEditorsController = getAllEditorsController;
// Get all reviewer
const getAllReviewersController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userServices.getAllReviewer();
        res.status(200).json({ success: true, total: users.length, data: users });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getAllReviewersController = getAllReviewersController;
// Create new user (from Auth0 webhook)
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id, email, name, role, picture } = req.body;
        if (!auth0Id || !email || !name || !role) {
            res.status(400).json({
                success: false,
                message: "auth0Id, email, name and role are required",
            });
        }
        const newUser = yield userServices.createUser({
            auth0Id,
            email,
            name,
            role,
            picture,
        });
        res.status(201).json({ success: true, data: newUser });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createUserController = createUserController;
// Delete user by id
const deleteUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userServices.getUserById(id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        yield userServices.deleteUserById(id);
        res
            .status(200)
            .json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteUserByIdController = deleteUserByIdController;
