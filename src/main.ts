import express from "express";
import { userRouter, authRouter, docsRouter } from "./app/index";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use(docsRouter);
app.use(authRouter);
app.use(userRouter);

export default app;
