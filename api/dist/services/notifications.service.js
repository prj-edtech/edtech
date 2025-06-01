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
exports.markAllAsRead = exports.getAllNotifications = exports.createNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationData = {
        notificationId: `notif_${Math.random().toString(36).substring(2, 15)}`,
        userId: data.userId,
        eventType: data.eventType,
        entityType: data.entityType,
        entityId: data.entityId,
        title: data.title,
        message: data.message,
    };
    return yield db_1.default.notification.create({
        data: Object.assign(Object.assign({}, notificationData), { notificationJson: notificationData }),
    });
});
exports.createNotification = createNotification;
const getAllNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.notification.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            isRead: false,
        },
        include: {
            User: true,
        },
    });
});
exports.getAllNotifications = getAllNotifications;
const markAllAsRead = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.notification.updateMany({
        data: {
            isRead: true,
        },
    });
});
exports.markAllAsRead = markAllAsRead;
