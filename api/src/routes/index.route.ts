import { Router } from "express";
import userRouter from "./users.route";
import auditRouter from "./auditTrail.route";
import boardRouter from "./boards.route";
import standardRouter from "./standards.route";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/audit-logs", auditRouter);
mainRouter.use("/boards", boardRouter);
mainRouter.use("/standards", standardRouter);

export default mainRouter;
