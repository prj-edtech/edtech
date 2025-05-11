"use strict";
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
exports.deleteUserById = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditTrail_service_1 = require("./auditTrail.service");
// Get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findMany();
});
exports.getAllUsers = getAllUsers;
// Get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findUnique({
        where: { id },
    });
});
exports.getUserById = getUserById;
// Create a new user (from Auth0 webhook)
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.create({
        data,
    });
    // Log creation event
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "USER",
        entityId: user.auth0Id,
        action: "CREATED",
        performedBy: user.auth0Id, // since it's their own creation, could be system user if via webhook
        details: {
            newState: user,
            notes: "New user created via Auth0 webhook.",
        },
    });
    return user;
});
exports.createUser = createUser;
// Delete user by id
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({ where: { id } });
    if (!user)
        throw new Error("User not found");
    yield db_1.default.user.delete({
        where: { id },
    });
    // Log deletion event
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "USER",
        entityId: user.auth0Id,
        action: "DELETED",
        performedBy: user.auth0Id,
        details: {
            previousState: user,
            notes: `User ${user.name} deleted.`,
        },
    });
    return user;
});
exports.deleteUserById = deleteUserById;
