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
exports.fetchAllChangeLog = exports.createChangeLog = void 0;
const db_1 = __importDefault(require("../config/db"));
const createChangeLog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const submittedAt = new Date();
    const changeLogData = {
        changeLogId: `clog_${Math.random().toString(36).substring(2, 15)}`,
        entityType: data.entityType,
        entityId: data.entityId,
        changeType: data.changeType,
        changeStatus: data.changeStatus,
        submittedBy: data.submittedBy,
        submittedAt: submittedAt,
        movedToDev: false,
        movedToQA: false,
        movedToProd: false,
        notes: data.notes || null,
        createdBy: data.createdBy,
    };
    return yield db_1.default.changeLog.create({
        data: Object.assign(Object.assign({}, changeLogData), { jsonData: changeLogData }),
    });
});
exports.createChangeLog = createChangeLog;
const fetchAllChangeLog = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.changeLog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            User: true,
        },
    });
});
exports.fetchAllChangeLog = fetchAllChangeLog;
