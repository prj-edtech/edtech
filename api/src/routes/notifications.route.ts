import { Router } from "express";
import * as notificationController from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.get("/", notificationController.getAllNotifications);

export default notificationRouter;
