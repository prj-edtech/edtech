import { Router } from "express";
import userRouter from "./users.route";
import auditRouter from "./auditTrail.route";
import boardRouter from "./boards.route";
import standardRouter from "./standards.route";
import subjectRouter from "./subjects.route";
import sectionRouter from "./sections.route";
import topicRouter from "./topics.router";
import subtopicRouter from "./subtopics.route";
import questionPaperRouter from "./questionPaper.route";
import changeLogRouter from "./changeLog.route";
import questionRouter from "./questions.route";
import notificationRouter from "./notifications.route";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/audit-logs", auditRouter);
mainRouter.use("/boards", boardRouter);
mainRouter.use("/standards", standardRouter);
mainRouter.use("/subjects", subjectRouter);
mainRouter.use("/sections", sectionRouter);
mainRouter.use("/topics", topicRouter);
mainRouter.use("/subtopics", subtopicRouter);
mainRouter.use("/question-papers", questionPaperRouter);
mainRouter.use("/questions", questionRouter);
mainRouter.use("/change-logs", changeLogRouter);
mainRouter.use("/notifications", notificationRouter);

export default mainRouter;
