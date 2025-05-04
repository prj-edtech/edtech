import { Router } from "express";
import * as boardControllers from "../controllers/boards.controller";

const boardRouter = Router();

boardRouter.get("/", boardControllers.getAllBoardsController);
boardRouter.get("/:id", boardControllers.getBoardByIdController);
boardRouter.post("/", boardControllers.createBoardController);
boardRouter.put("/:id", boardControllers.updateBoardController);
boardRouter.patch("/:id", boardControllers.deleteBoardController);

export default boardRouter;
