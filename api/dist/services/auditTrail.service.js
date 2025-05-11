"use strict";
// api\src\services\auditTrail.service.ts
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
exports.getAuditLogById = exports.getAllAuditLogs = exports.createAuditLog = void 0;
const db_1 = __importDefault(require("../config/db"));
const base62_1 = require("../utils/base62"); // we'll make this utility
// Create an Audit Log entry
const createAuditLog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const auditId = (0, base62_1.base62Encode)();
    return yield db_1.default.auditLog.create({
        data: {
            id: auditId,
            action: data.action,
            performedBy: data.performedBy,
            entityId: data.entityId,
            entityType: data.entityType,
            details: data.details,
        },
    });
});
exports.createAuditLog = createAuditLog;
// Get all Audit Logs
const getAllAuditLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.auditLog.findMany({
        orderBy: { createdAt: "desc" },
    });
});
exports.getAllAuditLogs = getAllAuditLogs;
// Get a single Audit Log by ID
const getAuditLogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.auditLog.findUnique({
        where: { id },
    });
});
exports.getAuditLogById = getAuditLogById;
