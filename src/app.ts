import "./config/env";

import express from "express";
import cors from "cors";
import routes from "./routes";

export const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "Server running" });
});

app.use("/api/v1", routes);
