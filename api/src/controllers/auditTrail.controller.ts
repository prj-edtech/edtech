// api\src\controllers\auditTrail.controller.ts

import { Request, Response } from "express";
import * as auditServices from "../services/auditTrail.service";

// GET /api/audit-logs
export const getAllAuditLogsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const logs = await auditServices.getAllAuditLogs();
    res.status(200).json({ success: true, total: logs.length, data: logs });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/audit-logs/:id
export const getAuditLogByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const log = await auditServices.getAuditLogById(id);
    if (!log) {
      res.status(404).json({ success: false, message: "Audit log not found" });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/audit-logs
export const deleteAllAuditLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await auditServices.deleteAllAuditLogs();
    res
      .status(200)
      .json({ success: true, message: "All audit logs deleted", data: logs });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
