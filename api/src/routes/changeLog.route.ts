import { Router } from "express";
import {
  deleteChangeLogs,
  getAllChangeLogs,
} from "../controllers/changeLog.controller";

const changeLogRouter = Router();

changeLogRouter.get("/", getAllChangeLogs);

changeLogRouter.delete("/", deleteChangeLogs);

export default changeLogRouter;
