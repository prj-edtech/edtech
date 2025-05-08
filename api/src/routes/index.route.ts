import { Router } from "express";
import userRouter from "./users.route";
import auditRouter from "./auditTrail.route";
import boardRouter from "./boards.route";
import standardRouter from "./standards.route";
import subjectRouter from "./subjects.route";
import sectionRouter from "./sections.route";
import topicRouter from "./topics.router";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/audit-logs", auditRouter);
mainRouter.use("/boards", boardRouter);
mainRouter.use("/standards", standardRouter);
mainRouter.use("/subjects", subjectRouter);
mainRouter.use("/sections", sectionRouter);
mainRouter.use("/topics", topicRouter);

export default mainRouter;
