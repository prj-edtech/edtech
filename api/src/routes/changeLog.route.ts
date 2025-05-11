import { Router } from "express";
import { getAllChangeLogs } from "../controllers/changeLog.controller";

const changeLogRouter = Router();

changeLogRouter.get("/", getAllChangeLogs);

export default changeLogRouter;
