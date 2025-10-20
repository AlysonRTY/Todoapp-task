import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
