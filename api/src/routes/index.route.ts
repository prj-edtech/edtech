import { Router } from "express";
import userRouter from "./users.route";
import auditRouter from "./auditTrail.route";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/audit-logs", auditRouter);

export default mainRouter;
