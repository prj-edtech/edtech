import { Router } from "express";
import * as notificationController from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.get("/", notificationController.getAllNotifications);
notificationRouter.patch("/readall", notificationController.markAllAsRead);

export default notificationRouter;
