// api\src\routes\auditTrail.route.ts

import { Router } from "express";
import * as auditControllers from "../controllers/auditTrail.controller";

const auditRouter = Router();

auditRouter.get("/", auditControllers.getAllAuditLogsController);
auditRouter.get("/:id", auditControllers.getAuditLogByIdController);
auditRouter.delete("/", auditControllers.deleteAllAuditLogs);

export default auditRouter;
