import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server working");
});

export default app;
