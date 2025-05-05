import { Router } from "express";
import * as userControllers from "../controllers/users.controller";

const userRouter = Router();

// GET /api/users — get all users
userRouter.get("/", userControllers.getAllUsersController);

// GET /api/users/:id — get user by ID
userRouter.get("/:id", userControllers.getUserByIdController);

// POST /api/users — create a new user (likely via Auth0 webhook)
userRouter.post("/", userControllers.createUserController);

// DELETE /api/users/:id — delete a user
userRouter.delete("/:id", userControllers.deleteUserByIdController);

export default userRouter;
