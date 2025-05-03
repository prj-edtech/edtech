import { Router } from "express";
import * as userControllers from "../controllers/users.controller";

const userRouter = Router();

userRouter.get("/", userControllers.getAllUsersController);

export default userRouter;
