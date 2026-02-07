
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/",uploadRoutes);

export default app;
