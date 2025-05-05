import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "./routes/index.route";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server working");
});

export default app;
