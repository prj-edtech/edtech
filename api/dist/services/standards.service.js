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
exports.deactivateStandard = exports.updateStandard = exports.getStandardById = exports.getAllStandards = exports.createStandard = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditTrail_service_1 = require("./auditTrail.service");
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
    return updatedStandard;
});
exports.updateStandard = updateStandard;
const deactivateStandard = (id, performedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedStandard = yield (0, exports.updateStandard)(id, {
        isActive: false,
        updatedBy: performedBy,
    });
    // Log as DEACTIVATE instead of UPDATE
    yield (0, auditTrail_service_1.createAuditLog)({
        entityType: "STANDARD",
        entityId: updatedStandard.id,
        action: "DEACTIVATE",
        performedBy,
        details: updatedStandard.standardJson,
    });
    return updatedStandard;
});
exports.deactivateStandard = deactivateStandard;
