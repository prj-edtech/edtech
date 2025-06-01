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
exports.getStandardByBoard = exports.deleteStandard = exports.activateStandard = exports.deactivateStandard = exports.updateStandard = exports.getStandardById = exports.getAllActiveStandards = exports.getAllStandards = exports.createStandard = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditTrail_service_1 = require("./auditTrail.service");
const changeLog_service_1 = require("./changeLog.service");
const notifications_service_1 = require("./notifications.service");
// Utility to validate Roman numerals (I to XII)
const isRomanNumeral = (value) => /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/.test(value);
// Type guard for JsonObject
function isJsonObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
// Create a new Standard
const createStandard = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield db_1.default.board.findUnique({
        where: { id: data.boardId },
    });
    if (!board) {
        throw new Error("Board not found.");
    }
    // Validate Roman numeral format
    if (!isRomanNumeral(data.sortKey)) {
        throw new Error("sortKey must be a valid Roman numeral between I and XII.");
    }
    const partitionKey = `Standard#${board.sortKey}`;
    // Check for duplicate (partitionKey + sortKey)
    const existing = yield db_1.default.standard.findFirst({
        where: { partitionKey, sortKey: data.sortKey },
    });
    if (existing) {
        throw new Error("A standard with this sortKey already exists under the selected board.");
    }
    const timestamp = new Date().toISOString();
    const standardJson = [
        {
            partitionKey,
            sortKey: data.sortKey,
            attributes: {
                displayName: data.sortKey,
            },
            isActive: true,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
        },
    ];
    const newStandard = yield db_1.default.standard.create({
        data: {
            partitionKey,
            sortKey: data.sortKey,
            isActive: true,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            boardId: data.boardId,
            standardJson,
        },
    });
    // Log to audit trail
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: newStandard.id,
        action: "CREATE",
        performedBy: data.createdBy,
        details: standardJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "STANDARDS",
        entityId: newStandard.id,
        changeType: "CREATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.createdBy,
        createdBy: data.createdBy,
        notes: "Standard created without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.createdBy,
        eventType: "STANDARD",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: newStandard.id,
        title: "Standard Created",
        message: `New standard created`,
    });
    return newStandard;
});
exports.createStandard = createStandard;
const getAllStandards = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.standard.findMany({
        include: {
            board: true, // include associated board details
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
exports.getAllStandards = getAllStandards;
const getAllActiveStandards = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.standard.findMany({
        where: {
            isActive: true,
        },
        include: {
            board: true, // include associated board details
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
exports.getAllActiveStandards = getAllActiveStandards;
const getStandardById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.standard.findUnique({
        where: { id },
        include: {
            board: true,
        },
    });
});
exports.getStandardById = getStandardById;
const updateStandard = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const standard = yield db_1.default.standard.findUnique({
        where: { id },
    });
    if (!standard) {
        throw new Error("Standard not found.");
    }
    const updatedAt = new Date().toISOString();
    // Validate standardJson is an object
    if (!isJsonObject(standard.standardJson)) {
        throw new Error("Invalid standardJson format.");
    }
    const updatedJson = Object.assign(Object.assign({}, standard.standardJson), { isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : standard.isActive, updatedAt, updatedBy: data.updatedBy });
    const updatedStandard = yield db_1.default.standard.update({
        where: { id },
        data: {
            isActive: (_b = data.isActive) !== null && _b !== void 0 ? _b : standard.isActive,
            updatedBy: data.updatedBy,
            updatedAt: new Date(),
            standardJson: updatedJson,
        },
    });
    // Audit log entry for UPDATE action
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: updatedStandard.id,
        action: "UPDATE",
        performedBy: data.updatedBy,
        details: updatedJson, // we log the full updated JSON payload for traceability
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "STANDARDS",
        entityId: updatedStandard.id,
        changeType: "UPDATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: data.updatedBy,
        createdBy: data.updatedBy,
        notes: "Standard updated without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: data.updatedBy,
        eventType: "STANDARD",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: updatedStandard.id,
        title: "Standard Updated",
        message: `New standard updated`,
    });
    return updatedStandard;
});
exports.updateStandard = updateStandard;
const deactivateStandard = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const standard = yield db_1.default.standard.update({
        where: {
            id,
        },
        data: {
            updatedBy: performedBy,
            isActive: false,
        },
    });
    // Log as DEACTIVATE instead of UPDATE
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: standard.id,
        action: "DEACTIVATE",
        performedBy,
        details: standard.standardJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "STANDARDS",
        entityId: standard.id,
        changeType: "DEACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Standard soft deleted without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "STANDARD",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: standard.id,
        title: "Standard Deactivated",
        message: `New standard deactivated`,
    });
    return standard;
});
exports.deactivateStandard = deactivateStandard;
const activateStandard = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const standard = yield db_1.default.standard.update({
        where: {
            id,
        },
        data: {
            updatedBy: performedBy,
            isActive: true,
        },
    });
    // Log as ACTIVATE instead of UPDATE
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: standard.id,
        action: "ACTIVATE",
        performedBy,
        details: standard.standardJson,
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "STANDARDS",
        entityId: standard.id,
        changeType: "ACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Standard activated without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "STANDARD",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: standard.id,
        title: "Standard Activated",
        message: `New standard activated`,
    });
    return standard;
});
exports.activateStandard = activateStandard;
const deleteStandard = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedStandard = yield db_1.default.standard.delete({
        where: {
            id,
        },
    });
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: id,
        action: "DELETE",
        performedBy: performedBy,
        details: "N/A",
    });
    yield (0, changeLog_service_1.createChangeLog)({
        entityType: "STANDARDS",
        entityId: id,
        changeType: "ACTIVATE",
        changeStatus: "AUTO_APPROVED",
        submittedBy: performedBy,
        createdBy: performedBy,
        notes: "Standard hard deleted without needing to be reviewed",
    });
    yield (0, notifications_service_1.createNotification)({
        userId: performedBy,
        eventType: "STANDARD",
        entityType: "SYSTEM_ANNOUNCEMENT",
        entityId: id,
        title: "Standard Deleted",
        message: `New standard deleted`,
    });
    return deletedStandard;
});
exports.deleteStandard = deleteStandard;
const getStandardByBoard = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const standard = yield db_1.default.standard.findMany({
        where: {
            boardId,
            isActive: true,
        },
    });
    return standard;
});
exports.getStandardByBoard = getStandardByBoard;
